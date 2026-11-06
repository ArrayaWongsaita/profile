# User profile

A single-page personal profile built with plain HTML, CSS and JavaScript. No build step.

## Edit your content

- `index.html`: replace the name, role, projects, experience and links.
- The machine-readable lines on the card are generated from the `data-*` attributes on `<article class="card">`
  (`data-surname`, `data-given`, `data-country`, `data-number`, `data-since`, `data-updated`; dates are `YYMMDD`).
- To use a photo, replace the `.photo` monogram with `<img src="assets/photo.jpg" alt="...">`.
- Colors and fonts are tokens at the top of `css/style.css`.

## Preview locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy to GitHub Pages

1. Create a repository on GitHub. For a root URL (`https://<username>.github.io`), name it `<username>.github.io`.
2. Push this folder:
   ```sh
   git init
   git add .
   git commit -m "Add profile site"
   git branch -M main
   git remote add origin https://github.com/<username>/<repo>.git
   git push -u origin main
   ```
3. On GitHub, open **Settings → Pages**, set **Source** to *Deploy from a branch*, choose `main` and `/ (root)`, then save.
4. The site is live at `https://<username>.github.io/<repo>/` after a minute or so.

All asset paths are relative, so the site works under a repository sub-path.
