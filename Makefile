.PHONY: build update
default: build
build: update
	deno run --allow-all build.ts --input ./example --output example_data.ts
update:
	echo 'export const template = `' > template_text.ts
	cat template.ts >> template_text.ts
	echo '`' >> template_text.ts
