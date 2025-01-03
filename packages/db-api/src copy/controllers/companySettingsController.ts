import { Request, Response } from 'express';
import { readPrisma, writePrisma } from '../prisma';
import { handle500Response } from '../helpers';
import { COMPANY_ID } from '../constants';

export const getCompanySettings = async (_req: Request, res: Response) => {
  /* const { companyId } = req.query; */
  const companyId = COMPANY_ID;
  if (!companyId) {
    return res
      .status(400)
      .json({ message: 'companyId query parameter is required' });
  }

  try {
    const settings = await readPrisma.companySettings.findMany({
      where: {
        companyId: companyId,
        deletedAt: null,
      },
      select: {
        id: true,
        logoUrl: true,
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.json(settings);
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error fetching company settings',
      'getCompanySettings',
    );
  }
};

export const createCompanySettings = async (req: Request, res: Response) => {
  const { logoUrl, companyId } = req.body;

  if (!companyId) {
    return res.status(400).json({ message: 'companyId is required' });
  }

  try {
    const newSettings = await writePrisma.companySettings.create({
      data: { logoUrl: logoUrl ?? null, companyId },
    });
    res.status(201).json(newSettings);
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error creating company settings',
      'createCompanySettings',
    );
  }
};

export const updateCompanySettings = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { logoUrl } = req.body;

  try {
    const updatedSettings = await writePrisma.companySettings.update({
      where: { id: parseInt(id) },
      data: { logoUrl },
    });
    res.json(updatedSettings);
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error updating company settings',
      'updateCompanySettings',
    );
  }
};

export const deleteCompanySettings = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await writePrisma.companySettings.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() },
    });
    res.status(200).json({ message: `Company settings ${id} deleted.` });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error deleting company settings',
      'deleteCompanySettings',
    );
  }
};

export const updateCompany = async (req: Request, res: Response) => {
  const id = COMPANY_ID;
  const { name, logoUrl } = req.body;

  if (!name && !logoUrl) {
    return res.status(400).json({
      message: 'At least one of name or logoUrl must be provided for update',
    });
  }

  try {
    // Update company name if provided
    if (name) {
      await writePrisma.company.update({
        where: { id },
        data: { name },
      });
    }

    // Update company settings logoUrl if provided
    if (logoUrl) {
      // Ensure settings exist, create if missing
      let settings = await readPrisma.companySettings.findFirst({
        where: { companyId: id, deletedAt: null },
      });

      if (!settings) {
        settings = await writePrisma.companySettings.create({
          data: {
            companyId: id,
            logoUrl,
          },
        });
      } else {
        await writePrisma.companySettings.update({
          where: { id: settings.id },
          data: { logoUrl },
        });
      }
    }

    res.status(200).json({ message: 'Company details updated successfully.' });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error updating company details',
      'updateCompany',
    );
  }
};
