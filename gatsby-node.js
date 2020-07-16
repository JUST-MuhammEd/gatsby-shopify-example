const path = require(`path`)
exports.createPages = async ({ graphql, actions }) => {
	const { createPage } = actions
	// Query for all products in Shopify
	const result = await graphql(`
    query {
      allShopifyProduct(sort: { fields: [title] }) {
        edges {
          node {
            title
            images {
              originalSrc
            }
            shopifyId
            handle
            description
            availableForSale
            priceRange {
              maxVariantPrice {
                amount
              }
              minVariantPrice {
                amount
              }
            }
          }
        }
      }
    }
  `)
	// Iterate over all products and create a new page using a template
	// The product "handle" is generated automatically by Shopify
	result.data.allShopifyProduct.edges.forEach(({ node }) => {
		createPage({
			path: `/product/${node.handle}`,
			component: path.resolve(`./src/templates/product.js`),
			context: {
				handle: node.handle
			}
		})
	})
}
