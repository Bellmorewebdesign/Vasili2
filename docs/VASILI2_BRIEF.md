# Vasili2: Claude build prompt

Build a complete, working static website prototype in the repository `Bellmorewebdesign/Vasili2`. Use the branding and asset pack uploaded to this repository. Implement the site, its pages, and its interactions. Do not stop at a plan.

This brief is self-contained. You do not need access to another website or a previous conversation. It defines a second design option for the client, with a specific visual direction and page structure.

## Read this before using the pack

Inspect `ASSET_GUIDE.md`, `data/assets.json`, `data/photo-groups.json`, the supplied photography, and the drawings in `references/` before building. If the pack is still zipped, extract it into a sensible project structure first.

The pack may contain an older `CLAUDE_PROMPT.md` titled "Build the first Vasili visual prototype" and older design instructions in `README.md`. THIS brief replaces those creative and page-structure instructions for Vasili2. Retain their factual asset information and original files. Do not accidentally implement the older prompt. The screenshot `references/current-homepage-draft.png` is reference material, not a layout to reproduce. Follow any actual repository safety instructions normally.

## Brand and purpose

Vasili makes jewelry inspired by American traditional tattoo imagery, particularly the distinctive chains and forms in the supplied drawings. The client wants an art experience with shopping inside it. His reference is "Yeezy, not Nike": unusual, spare, slightly eerie, luxurious, and personal. The jewelry and its relationships should carry the experience.

The exploration idea is inspired by discovering connected places in a game. Do not use game characters, pixel art, game HUDs, or borrowed game styling. Build the visual identity around the actual jewelry and the client's own drawings.

This is a visual prototype. Editorial copy, exact product relationships, video, and ad content are pending. Shopify may be connected later. There are no transactions or real submissions in this version.

## Design direction: a pale-blue jewelry gallery

Use a predominantly light, icy-blue environment with deep navy architectural elements, dark photographic stages, and sharp rectangular framing. It should feel like walking through a carefully arranged exhibition of metal objects. Use large areas of quiet space and sudden changes in image scale.

Use these existing prototype palette values in new proportions. These are working design tokens, not a claim that a formal brand manual specifies them:

- `#D6EAFF`: dominant icy-blue page field.
- `#C3D1E2`: secondary pale blue for inset surfaces.
- `#7F9BBD`: muted blue for nonessential rules and decoration.
- `#0F1927`: deep navy for navigation, controls, and readable text on pale backgrounds.
- `#05080E`: near-black for selected photographic stages and the hidden map.
- `#8FD0FF`: restrained interactive accent on dark backgrounds.

Aim for approximately 65 percent pale blue, 25 percent navy or near-black, and 10 percent supporting tones across interface surfaces, excluding photographs. Do not make the entire website dark. Avoid adding unrelated accent colors. Natural colors already present in the photos are welcome.

Jewelry must remain crisp and visually prominent. Preserve its real metal color, highlights, and detail. Do not wash product photos with a blue overlay. Place lighter product photography inside dark framing where helpful, so bright metal and image whites remain the strongest highlights.

Use a restrained grotesk sans-serif for navigation and placeholders, with occasional small monospaced item numbers. Avoid large italic serif headlines. Preserve the supplied logo exactly, including its proportions and paths. Put the white SVG on navy. Do not redraw the lettering or use the unusable black JPG as a logo.

Use squared corners, thin rules, intentional alignment, and broad margins. No pill-shaped card system, glass panels, decorative gradient blobs, neon glow, heavy grain, faux luxury gold, or generic marketing-page section stack. Do not stretch the entire interface across a fixed desktop canvas that breaks on phones.

## Text rules

Do not write marketing copy, slogans, a brand story, product descriptions, collection narratives, testimonials, prices, policy language, or invented factual claims. Do not copy the words from the old homepage screenshot. Do not use lorem ipsum. Do not use em dashes anywhere in authored visible text or this project's handoff documentation.

Use short placeholders only where content needs a demonstrated position: `[Heading]`, `[Text]`, `[Product name]`, `[Product details]`, `[Video]`, `[Ad]`, and `[Email]`. Keep most surfaces visual. Do not put a giant `[Heading]` at the center of every page or simulate long essays with repeated placeholder paragraphs.

The real Vasili logo, the supplied labels City and NIC, and necessary interface labels are allowed. Examples: Pieces, Index, Studio, Journal, FAQ, Back, Close, Next, Previous, Details, See origin, and Email. These are navigation, not invented brand copy. Write useful alt text and accessible control labels normally.

## Navigation and page structure

On desktop, use a fixed navy rail about 104 pixels wide at the left. Put the white Vasili logo near its top, sized legibly. Below it, stack Pieces, Index, Studio, and Journal. Keep text horizontal. Add a small Info button near the bottom. Give the active destination a simple line marker. The pale-blue content begins to the right of this rail.

Info opens a compact accessible overlay containing FAQ, Custom Inquiries, Shipping, and Returns. Do not create a large repeated directory footer. On mobile, replace the rail with a compact navy top bar containing the logo and Menu. The menu opens the same destinations. Do not squeeze the desktop rail onto a phone.

Use this deliberate new structure:

- `index.html`: visual exhibition homepage.
- `pieces.html`: the complete sample product selection with working category filters.
- `collection.html?id=city` and `collection.html?id=nic`: two distinct visual collection layouts using one reusable template. City and NIC are inherited draft labels, not permission to invent collection stories or product membership. Any other unconfirmed collection titles stay placeholders.
- `product.html?id=...`: reusable product presentation.
- `studio.html`: combine the formerly separate About, Preface, and Collaborations content areas into one sparse image-led page with three selectable sections and placeholder content.
- `journal.html`: combine News and blog into one visual index. Open sample entries in accessible panels with placeholder titles and text.
- `info.html`: FAQ, Custom Inquiries, Shipping, and Returns in accessible sections with addressable anchors. These are layouts only. No invented policies or claims.
- `origin.html`: the hidden interactive drawing.

Index is an overlay for navigating City, NIC, and the sample collections, not a link to the origin map. Do not confuse the two. Consolidate product categories into filters instead of creating a separate page for every category. This option intentionally has fewer public pages while retaining room for the client's main material.

## Homepage composition

The first viewport is an object stage, not a headline-and-button hero. Do not use a text column beside the hands-over-flame photo, a decorative vertical chain in the middle, or a centered logo in a conventional top header.

Within the pale-blue main field, position one large, dark rectangular image stage slightly right of center, approximately 60 percent of the available content width and 65 to 75 percent of the viewport height. Leave generous empty space around it. Start with a strong supplied studio/product image chosen after inspection. The silver bracelet photograph `One-Thirty_New_York0539.jpg` is a candidate; its white background must stay clean and deliberate inside the dark frame. Do not fabricate a transparent cutout with crude blend modes.

Near the lower-left edge of the stage, overlap a much smaller, sharply framed worn-jewelry photograph from the same confirmed photo group. Keep the main piece unobstructed. If no matching second view exists, use a single image rather than pretending a different piece is the same product.

Below the stage, place a slim control line with `01 / 04`, Previous, Next, and View piece. Create four curated slides using the real supplied assets. Use a short crossfade, no autoplay. View piece opens the matching product. Swiping works on mobile, with visible buttons as an alternative. The homepage contains no headline, sales paragraph, or large promotional CTA.

After the first viewport, add one compact asymmetric collection composition: a tall City image and a smaller offset NIC image, with a quiet framed `[Video]` space between or below them. Collection membership is provisional data, not an asserted story. Each collection tile opens its collection page. Keep this section spacious instead of adding a product carousel, category grid, and several more photo bands.

Finish with a small email layout integrated into a thin navy bottom strip. The page should feel edited and finite, roughly two to three desktop viewports. Put the `[Ad]` placement in the Journal layout instead of interrupting the homepage.

## Pieces and collections

Pieces uses an asymmetric exhibition grid with varied image sizes: one large image occupying two columns, then smaller images with generous spacing. Preserve a logical reading order. Use supplied photos, item numbers, and `[Product name]`, without prices or badges.

Use small text filters based only on supported sample product categories. Filtering must work. Avoid fake inventory counts. Clicking a piece opens its product page. An optional Quick view control may open an accessible image-and-details panel, but it must not expose the origin link.

City opens with a broad landscape image and a sparse two-column product arrangement. NIC opens with an offset portrait image and a staggered arrangement. Both share the same typography and palette but differ visibly in composition. On mobile, simplify both into an intentional vertical sequence.

## Product layout

Make the product feel like an exhibited object. Use a large image stage spanning most of the content width, with a compact thumbnail strip beneath. Place item number, `[Product name]`, and Details in a narrow pale-blue band below the photography rather than a standard wide purchase column beside it.

Details opens an in-flow accordion below that band. Inside it, show `[Product details]`, a reserved options area only where needed, and a quiet See origin link. Keep this link within the product-description area. Do not promote it as a large standalone button.

Give the page a close-up lightbox, a reserved `[Video]` frame, and a restrained related-piece area. Where no actual additional media exists, use a placeholder or omit that extra image. No active cart, fake checkout, fictional sizes, stock messaging, or invented materials. Keep the data structure ready for future Shopify identifiers without connecting Shopify now.

## Hidden drawing and discoveries

The only public entries into the origin experience are See origin inside a product description and one contextual link inside an expanded FAQ answer. Never link to it from the homepage, navigation rail, mobile menu, Index, footer, collection tiles, product-grid cards, or a public search interface. This is deliberate discoverability, not password protection.

Use `references/02-origin-map-overview.jpeg` as the composition authority and `03` through `06` for the details. Use `01`, `07`, and `08` as supporting chain studies. Several photographs show the same sheets; do not turn them into eight separate maps.

Reproduce the main drawing's long, vertically flowing spiked chain, actual component silhouettes, relative positions, surrounding jewelry families, and faint branch connectors as closely as practical in clean SVG linework. Preserve the drawing's layout on a large pannable canvas. Do not replace it with a generic network of circles, symmetrical skill tree, horizontal timeline, or unrelated decorative chain. Do not show the whole paper photograph with bedding, hands, or room background as finished page art.

This hidden area changes to near-black with icy-blue linework, making discovery feel like entering a different room. Keep the controls minimal: Back, Overview, zoom in, zoom out, and Close where appropriate. Product photos in opened panels retain natural color.

On entry through the FAQ, begin close to the central chain. Selecting an attached form reveals the next level of its branch. Implement at least two working levels. Overview fits the discovered drawing into view. Keep the complete diagram data available so it can be corrected without rebuilding the interface.

On entry from a product, a URL such as `origin.html?node=demo-a&piece=piece-a` must reveal that node's ancestor path, focus it, and open the appropriate product panel immediately. Do not require visitors to rediscover the path to an item they already selected. Preserve node and panel state across refresh and browser Back.

A node opens a photograph/detail panel with short placeholders. A Study control within the hidden experience opens a larger drawing detail and `[Video]` frame. A further quiet control can open a family contact sheet of related assets. These discoveries remain inside the hidden experience and always offer an obvious return path. Do not add random riddles, passwords, or dead-end secret pages.

Exact product ancestry has not been confirmed. Store provisional relationships separately from the drawing geometry and product data. Mark affected panels `[Connection to confirm]`. Do not invent jewelry, historical relationships, or product names. Drawings are authoritative for form and structure, but do not by themselves prove which photographed product belongs to which node.

## Interaction, mobile, and media

Use subtle crossfades, restrained image movement, and 150 to 300 millisecond interface transitions. No custom cursor, scroll hijacking, forced loading intro, background audio, or excessive parallax. Respect reduced-motion preferences.

Menus, panels, filters, slides, and map nodes must work with keyboard and touch. Restore focus after closing dialogs, support Escape, and provide visible focus states. Use comfortably sized tap targets and readable navy text on pale blue. Keep faded decorative colors away from essential small text.

On phones, the homepage stage becomes nearly full width, the secondary photo moves below or overlaps only a safe margin, and the carousel controls remain visible. Product and collection pages stack naturally. The map remains pannable, with an accessible node-list alternative and a mobile bottom-sheet detail panel. Avoid accidental whole-page horizontal overflow.

Place a restrained email-field layout near the bottom of every public page. In the fullscreen map, put it at the bottom of its scrollable detail area so it does not obstruct exploration. No data may be stored or transmitted. Use a disabled submission control with a short `[Signup pending]` indication. Treat custom-inquiry submission similarly. Do not show success messages for actions that do not actually submit.

Video and ad placements are quiet framed rectangles with `[Video]` or `[Ad]`. No fake playback or ad-network integration. Keep implementation commentary in the README rather than decorating the site with developer notes.

## Assets and GitHub Pages

Use the actual uploaded assets. `assets/brand/vasili-logo-white.svg` is the usable logo. `references/logo-black-thick-original.jpg` is an unusable solid-black reference. Preserve originals and generate optimized web derivatives. `DSC07321.png` is a large hands-over-flame image; it can appear later in Studio or Journal but must not lead this homepage.

Use plain HTML, CSS, and JavaScript with no required server or runtime build. Put the completed `index.html` and other HTML entry points at the repository root, with shared CSS, JavaScript, and data files. Include `.nojekyll`. Keep content editable through a small data layer rather than duplicating product records across pages.

The target deployment URL is `https://bellmorewebdesign.github.io/Vasili2/`. All links, CSS URLs, scripts, images, and fetched data must work under `/Vasili2/`. Use relative paths, respect filename case, and use actual `.html` pages plus query strings or hashes. Do not rely on server rewrites, root-relative `/assets/...` paths, localhost, or client-only history routes. Never hardcode links back to the Vasili repository.

Write concise README instructions for GitHub Pages deployment from the `main` branch and `/ (root)`. The checked-in output must be directly deployable using that setting. Do not claim the site is published unless deployment actually succeeds. Build only within Vasili2; do not change the original Vasili repository or the live client store.

## Finish and verify

Before finishing, inspect desktop and mobile layouts and fix clipped images, unreadable controls, overlapping content, and dead links. Verify all homepage slides, collection links, product galleries, filters, menus, and dialogs. Test assets and navigation under the actual `/Vasili2/` subpath.

Test the full product > Details > See origin > node panel > product round trip. Test FAQ entry, direct node URLs, refresh, Back, progressive branch discovery, and keyboard closing/focus restoration. Check every public navigation surface for accidental map links.

Check that visible editorial content is placeholder-only, no em dashes were authored, no fake prices or claims appear, and forms do not transmit data. Ensure the final visual identity is predominantly pale blue, uses the navy side rail, leads with an object stage, and has the consolidated public structure specified above.

Finish with a short implementation summary, deployment instructions, and a list of the provisional asset groupings and drawing connections that need client confirmation. The actual site should already be built and ready to review.
