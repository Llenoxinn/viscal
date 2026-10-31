# Viscal design notes

## Direction

The user supplied screenshots from KIVOO's Behance presentation. The design takes its Urbanist typography, electric yellow (`#FFFF00`), soft black (`#2A2928`), rounded controls, and ribbed sculptural material into an original mathematical art studio.

Design Taste's app-screen draw used seed `257247241` and the **True-black flat** direction, with palette and typography retained from the supplied reference. No redraws were used. The reference overrides the direction's neutral primary button with one yellow **Surprise me** action and its editorial two-line introduction. The studio's face is the ribbed yellow trefoil; its signature functional element is the real, parameter-driven artwork.

The screen answers **“What does this rule look like, and what changes when I adjust it?”** The artwork leads; sliders, presets, and exports are immediately adjacent. All counts, settings, and formulas come from the engines. No sample financial data, testimonials, or usage statistics were added.

## Image-first process

The built-in image-generation tool produced a full desktop studio concept before implementation, followed by a separate transparent illustration. The comp established the two-line heading, thin engine navigation, 24px surfaces, white export pill, and aligned canvas/control columns. The final interface uses real React controls and SVG/Canvas artwork, rather than a screenshot of the concept.

Final generation briefs:

- **Studio concept:** a landscape 1440 × 1000 Viscal web app; Urbanist, electric yellow, neutral black; a two-line “A little math. A wild imagination.” heading; an original ribbed trefoil on the right; three engine tabs; a live vector canvas beside labeled sliders, native preset selection, appearance disclosure, export, randomize, and reset. Use the supplied screenshots only for style. Exclude fintech content, KIVOO branding, and Behance chrome.
- **Trefoil asset:** a single three-lobed mathematical ribbon knot with continuous rounded ribs; glossy satin electric-yellow polymer, golden self-shadowing and cream highlights; orthographic three-quarter studio lighting; centered on transparency with no lettering, floor, coins, or other objects. Match the approved concept's sculpture.

The project asset is [the optimized trefoil](../public/artwork/trefoil-knot.webp), a 640px transparent WebP of about 62 KB. The raw concept stays in ignored `output/design/`. Documentation previews are [desktop](studio-preview.webp) and [mobile](mobile-preview.webp).

## Interaction and validation

Emil's interaction guidance takes precedence over marketing-style scroll choreography in the working studio: short press feedback, immediate keyboard changes, and reduced-motion support. No animation library or scroll pinning is needed for these interactions.

Native SVG and Canvas use `role="img"` with meaningful accessible names. The lint exception for `prefer-tag-over-role` is scoped to the engine views: replacing editable SVG/Canvas with an HTML image would remove the rendering/export behavior. All other enabled accessibility checks remain active.

Design inspection passed at 1440, 768, and 390px with no failures. Its remaining title-size warning is intentional: the large two-line introduction follows the supplied visual reference, while working control labels stay compact and readable. Source-lint allowances cover only the optional dot grid and the value-dependent slider fill; both are functional guides. Form labels and the modal's overlay shadow are retained for usability.

Browser checks cover all engines at widths 320, 375, 768, 1024, and 1440; preset limits, keyboard controls, state preservation, pause/reset/painting, inactive-engine stopping, reduced motion, and PNG/SVG downloads. Urbanist loads locally, the optimized illustration resolves, exports use the selected theme, and 2× PNG dimensions are doubled.
