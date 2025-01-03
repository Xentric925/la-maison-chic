FORMAT_CMD="npm run format"
LINT_CMD="npm run format"

# Check if an argument is provided and set the format command accordingly
if [ "$1" == "check" ]; then
  FORMAT_CMD="npm run format:check"
  LINT_CMD="npm run lint:check"
fi

cd ./packages/db-api
$FORMAT_CMD
$LINT_CMD

cd ../web-app
$FORMAT_CMD
$LINT_CMD

cd ../jobs
$FORMAT_CMD
$LINT_CMD

cd ..
