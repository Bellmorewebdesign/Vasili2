# Vasili2

Visual prototype for Vasili: a polished jewelry-brand site in the brand's blue palette, with the real logo and photography, plus a hidden interactive drawing. Plain HTML, CSS and JavaScript. No build step, no server code, no transactions, and no data is stored or sent.

The current direction is a conventional, easy-to-browse layout: a horizontal header, a full homepage composition, and normal vertical scrolling. It replaces the earlier experimental side-rail homepage. The original brief is in `docs/VASILI2_BRIEF.md`, and the asset pack's original instructions are kept unchanged in `docs/pack/` for reference only.

## Structure

Header on every page: logo, Shop (opens a menu of categories and collections), About, Journal, FAQ. On phones it becomes a logo and a Menu button that opens the same links. Every page ends with an email signup band and a full footer (Shop, Collections, About, Help).

| File | What it is |
| --- | --- |
| `index.html` | Homepage: photo hero with heading, introduction and Shop buttons; featured pieces; collections; image-and-text About section; video placement |
| `pieces.html` | Shop: all pieces with filters (All pieces, Bracelets, Rings; `?cat=rings` works too) and an optional Quick view |
| `collection.html?id=city` | Wide banner opening, then the collection's pieces |
| `collection.html?id=nic` | Portrait photo beside the title, then the collection's pieces |
| `collection.html?id=sample` | A third `[Collection]` placeholder using the same template |
| `product.html?id=piece-a` | Gallery with zoom, description (with the quiet See origin link), size area on rings, Inquire button, Details / Care / Shipping accordions, video placement, more pieces. Ids: `piece-a` to `piece-d` |
| `studio.html` | About, with About, Preface and Collaborations as tabs (`#about`, `#preface`, `#collaborations`) |
| `journal.html` | News and journal: a featured entry, a grid of entries and one labeled `[Ad]` placement. Entries open in a panel (`?entry=j01`) |
| `info.html` | FAQ and help: FAQ, Custom Inquiries form, Shipping, Returns (`#faq`, `#custom`, `#shipping`, `#returns`) |
| `origin.html` | The hidden drawing (see below) |

### Placeholder text

The client's writing is not in yet, so every text area shows a short bracketed placeholder in the real typography, such as `[Heading here]`, `[Short introduction]`, `[Product name]` and `[Description here]`. Where a paragraph will run to several lines, faint line marks under the placeholder hold that space, so sections keep their final proportions instead of collapsing. Remove the `ph` and `ph-N` classes from an element once its real text is in.

There is no invented copy, pricing, product claims or story. Purchase is not active: product pages offer "Inquire about this piece" (a link to Custom Inquiries) with a `[Price and purchase pending]` note. The email and inquiry forms are disabled and send nothing.

Video and ad spaces are framed and labeled (`[Video]`, `[Ad]`) with no playback or live integration.

## The hidden drawing

`origin.html` is reachable from only two places on purpose:

1. Product page > Details > See origin (`origin.html?node=demo-a&piece=piece-a`)
2. The third FAQ answer on `info.html`, once expanded (`origin.html?entry=faq`)

It is not linked from the header, Shop menu, mobile menu, homepage, footer, collection tiles or product cards. This is discoverability, not protection: anyone with the URL can open it.

It is drawn as a white sheet with dark chain linework and muted-blue connectors, close to the client's drawings and the white-background product photos.

How it behaves:

- FAQ entry starts near the central chain with only the forms attached to it showing. Selecting a form reveals the next level of its branch (up to four levels on some branches). A small blue dot marks forms that still have hidden attachments.
- A product entry reveals the path to that node, focuses it, and opens the product panel straight away.
- Every selection is a real history entry (`?node=...&piece=...&view=study`), so refresh and the browser Back button keep the node and panel.
- Controls: Back (returns to the product or FAQ you came from), Overview, zoom out, zoom in, and List of forms (an accessible list alternative to the map). Drag to pan, scroll or pinch to zoom, arrow keys pan, plus and minus zoom.
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
- Web copies (800 and 1600 pixels wide, plus 4:5 crops of the four studio shots) are in `assets/web/`. To regenerate them: `python3 tools/make_derivatives.py` (needs Pillow).
- The logo is the supplied `assets/brand/vasili-logo-white.svg`, used as is on the navy header and footer. The black logo JPG is not used.
- Fonts (Cormorant Garamond, Hanken Grotesk, IBM Plex Mono) are self-hosted in `assets/fonts/` under the SIL Open Font License, so the site does not depend on Google Fonts.
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
- `DSC07321` (hands over flame) is not in any group. It is the homepage hero and the featured Journal image.

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
