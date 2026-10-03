# Vasili2

Second visual prototype for Vasili: a pale-blue jewelry gallery with a navy side rail, an object stage on the homepage, and a hidden interactive drawing. Plain HTML, CSS and JavaScript. No build step, no server code, no transactions, and no data is stored or sent.

The brief for this option is in `docs/VASILI2_BRIEF.md`. It replaces the creative and page-structure instructions in the original asset pack, which are kept unchanged in `docs/pack/` for reference only.

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Homepage: dark object stage with four slides (Previous, Next, swipe, arrow keys), then City, NIC and a `[Video]` frame |
| `pieces.html` | All sample pieces in an asymmetric grid. Filters: All, Bracelets, Rings (`?cat=rings` works too). Optional Quick view |
| `collection.html?id=city` | Landscape opening image, sparse two-column pieces |
| `collection.html?id=nic` | Offset portrait opening image, staggered pieces |
| `collection.html?id=sample` | A third `[Collection]` placeholder using the same template |
| `product.html?id=piece-a` | Product stage, thumbnails, lightbox, Details accordion, `[Video]`, related pieces. Ids: `piece-a` to `piece-d` |
| `studio.html` | About, Preface and Collaborations as three tabs (`#about`, `#preface`, `#collaborations`) |
| `journal.html` | News and journal entries in one index, with the `[Ad]` placement. Entries open in a panel (`?entry=j01`) |
| `info.html` | FAQ, Custom Inquiries, Shipping, Returns (`#faq`, `#custom`, `#shipping`, `#returns`) |
| `origin.html` | The hidden drawing (see below) |

Index (in the rail and the mobile menu) is an overlay for City, NIC, the placeholder collection and the category filters. Info is a small overlay with the four info links. Neither links to the drawing.

## The hidden drawing

`origin.html` is reachable from only two places on purpose:

1. Product page > Details > See origin (`origin.html?node=demo-a&piece=piece-a`)
2. The third FAQ answer on `info.html`, once expanded (`origin.html?entry=faq`)

It is not linked from the homepage, rail, mobile menu, Index, footer, collection tiles or product cards. This is discoverability, not protection: anyone with the URL can open it.

How it behaves:

- FAQ entry starts near the central chain with only the forms attached to it showing. Selecting a form reveals the next level of its branch (up to four levels on some branches). A small blue dot marks forms that still have hidden attachments.
- A product entry reveals the path to that node, focuses it, and opens the product panel straight away.
- Every selection is a real history entry (`?node=...&piece=...&view=study`), so refresh and the browser Back button keep the node and panel.
- Controls: Back (returns to the product or FAQ you came from), Overview, zoom out, zoom in, and Index of forms (an accessible list alternative to the map). Drag to pan, scroll or pinch to zoom, arrow keys pan, plus and minus zoom.
- Each panel has Study (larger drawing of the branch plus a `[Video]` frame; on the chain it adds the straight chain studies) and Family (a contact sheet of the branch and any linked photos).
- Panels for linked nodes are marked `[Connection to confirm]`.

### Where the drawing data lives

- `data/origin-geometry.js`: drawing form and layout only (chain ring positions, each form's position, shape, scale, frame circle and connector bends). Transcribed from `references/02-origin-map-overview.jpeg`, with `03` to `06` for details. Edit the numbers to correct the drawing; the interface redraws from them.
- `data/origin-links.js`: the provisional node to product pairings. Kept separate on purpose.
- `js/origin-shapes.js`: the SVG linework for each shape name.

## Editing content

All products, collections, slides, journal entries and studio sections are in `data/site-data.js`. Every page reads from there, so nothing is duplicated. Each product has an empty `shopify` field reserved for a future Shopify connection.

Visible editorial text is placeholder only: `[Heading]`, `[Text]`, `[Product name]`, `[Product details]`, `[Video]`, `[Ad]`, `[Email]`, plus `[Options]` on ring pages, `[Collection]`, `[Signup pending]`, `[Submission pending]` and `[Connection to confirm]`.

## Images

- Originals are untouched in `assets/photos/` and `references/`.
- Web copies (800 and 1600 pixels wide, plus tighter 4:5 crops of three studio shots) are in `assets/web/`. To regenerate them: `python3 tools/make_derivatives.py` (needs Pillow).
- The logo is the supplied `assets/brand/vasili-logo-white.svg`, used as is on navy. The black logo JPG is not used.
- Raw reference photos and originals are in the repository, so they are downloadable from a public deployment. Remove them from the published branch if that matters.

## Deploy on GitHub Pages

1. Merge this branch into `main`.
2. In the repository on GitHub, open Settings > Pages.
3. Under Build and deployment, choose Source: Deploy from a branch, Branch: `main`, folder: `/ (root)`, then Save.
4. After a minute or two the site should be at `https://bellmorewebdesign.github.io/Vasili2/`.

All paths are relative, so the site works under `/Vasili2/`. `.nojekyll` is included so GitHub serves the files as they are. The site has not been deployed from this branch yet.

To preview locally, serve the folder that contains `Vasili2` and open the subpath, for example:

```
cd ..
python3 -m http.server 8000
# open http://localhost:8000/Vasili2/
```

## Needs client confirmation

Photo groups (from `data/photo-groups.json`, which came from the old store's product galleries):

| Prototype id | Source handle (developer reference) | Photos |
| --- | --- | --- |
| `piece-a` (001, Bracelets) | mirror-link-bracelet-mids | One-Thirty_New_York0539, C8B550E0, 490966CD, 291BC55A, DCE7A7F3 |
| `piece-b` (002, Bracelets) | big-chunky-extendo-bracelet | Capture_One_Catalog0009, DSC09915, DSC09924, DSC09983, 20210107-_F6A3947-Edit, cropextedobb |
| `piece-c` (003, Rings) | gold-spur-ring | Capture_One_Catalog0006, VASILI121 |
| `piece-d` (004, Rings) | lull-ring | Capture_One_Catalog0004, VASILI129 |

- Some worn photos show other jewelry too (for example `20210107-_F6A3947-Edit` also shows rings; `VASILI121` shows several thin pieces). Confirm each photo belongs with its group.
- `cropextedobb` shows the piece worn at the neck although its group is a bracelet.
- `DSC07321` (hands over flame) is not in any group. It is used only in Studio and Journal.

Collection membership (all provisional):

- City: `piece-a`, `piece-b`
- NIC: `piece-c`, `piece-d`
- `[Collection]`: `piece-a`, `piece-d`

Drawing connections (all provisional, chosen only so the round trip can be demonstrated):

| Node | Drawing position | Linked to |
| --- | --- | --- |
| `demo-a` (D1.1) | lower-left branch, thorned loop | `piece-a` |
| `demo-b` (H2.1) | lower-right branch, second row | `piece-b` |
| `demo-c` (H4.1) | lower-right branch, fourth row | `piece-c` |
| `demo-d` (H5.1) | lower-right branch, fifth row | `piece-d` |

Drawing interpretation to check:

- The sheet's orientation follows the overview, with the chain running top to bottom.
- Family F (the framed figure-eight at upper right) has no visible line to the chain on the sheet, so none is drawn. Its four variants hang on an arc as on the sheet.
- The charm rows (E) and crosses (G) attach to the chain through a bracket; each charm is treated as one level and its hanging form as the next.
- Level order inside each branch (for example ring, then bracelet, then long chain) is read from the bracket lines and may need correcting.
- Codes such as A, D1.1 or H4 are interface references only, not names.

Still pending from the client: copy, product names, video, ad content, node labels, confirmed ancestry, and a usable version of the thicker black logo if that weight is wanted.
