# Render the docs

To render the docs locally, install the dependencies as follows:

1. [Install pixi](https://pixi.sh/latest/installation/)
2. To render the docs as HTML, ``cd`` into the docs folder run:

  ```bash
  pixi run render_html
  ```

3. To render the docs as PDF, run:

  ```bash
  pixi run install_tinytex
  pixi run render_pdf
  ```
