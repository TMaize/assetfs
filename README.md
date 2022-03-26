# assetfs

This package can embed binary data into a deno source code.

You can embed configuration files into source code, and build single file by `deno bundle`.

## Usage

```sh
deno run --allow-read --allow-write https://deno.land/x/assetfs/build.ts --input ./example --output example_data.ts
```

Or installs as an executable file

```sh
deno install --allow-read --allow-write -n assetfs_build https://deno.land/x/assetfs/build.ts
assetfs_build --input ./example --output example_data.ts
```

[example.ts](./example.ts)

```js
import * as fs from './example_data.ts'
```
