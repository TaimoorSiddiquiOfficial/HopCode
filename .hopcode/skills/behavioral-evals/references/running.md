# Running Behavioral Evals

## NPM Scripts

Eval npm scripts are registered in package.json.

```
npm run eval:behavioral:list            # List all behavioral evals
npm run eval:behavioral:run             # Runs behavioral evals, optionally filtered by grep
npm run eval:behavioral:run -- --grep='<regex>'
npm run eval:behavioral:promote         # Run CI evals only, optionally filtered
```

## Running a Single Eval

```
npm run eval:behavioral:run -- --grep='<eval-name>'
```

## Configuration

### Model

Override the model used by behavioral evals with `HOPCODE_EVAL_MODEL`:

```bash
HOPCODE_EVAL_MODEL='hopcode-2.5-pro' npm run eval:behavioral:run
```

For CI, behavioral evals use the default `ci:` configured model unless `HOPCODE_EVAL_MODEL` is set explicitly.

### Debug

Set `DEBUG=1` in your environment to capture more verbose output.

### Assertions

Behavioral evals can run in assert mode if `auto-assertions` have been implemented for the eval:

```
npm run eval:behavioral:assert -- --grep='<eval-name>'
```
