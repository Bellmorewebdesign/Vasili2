/*
  PROVISIONAL connections between drawing nodes and sample products.

  None of these are confirmed by the client. They were chosen only so the
  product > See origin > node panel round trip can be demonstrated.
  The drawing shows form and structure; it does not prove which photographed
  product belongs to which node. Every linked panel shows [Connection to confirm].

  To change a connection, edit the node id here and the matching `origin.node`
  in data/site-data.js. Node ids are defined in data/origin-geometry.js.
*/
window.VASILI = window.VASILI || {};

window.VASILI.originLinks = [
  { node: "demo-a", piece: "piece-a", status: "to-confirm", basis: "Placeholder pairing: thorned link loop on branch D" },
  { node: "demo-b", piece: "piece-b", status: "to-confirm", basis: "Placeholder pairing: heavy link loop on branch H2" },
  { node: "demo-c", piece: "piece-c", status: "to-confirm", basis: "Placeholder pairing: small link loop on branch H4" },
  { node: "demo-d", piece: "piece-d", status: "to-confirm", basis: "Placeholder pairing: small link loop on branch H5" }
];
