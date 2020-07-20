import React from 'react'
import { Link } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'
import Tile from '../components/tile'

const IndexPage = ({ data }) => (
	<Layout>
		<SEO title="Home" />
		<h1>Products</h1>
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: '1fr 1fr 1fr',
				gridGap: 60
			}}
		>
			{data.allShopifyProduct.edges.map(({ node }) => {
				const { minVariantPrice, maxVariantPrice } = node.priceRange
				const priceRange =
					minVariantPrice.amount == maxVariantPrice.amount
						? `R${Number(minVariantPrice.amount).toFixed(2)}`
						: `R${Number(minVariantPrice.amount).toFixed(2)}-R${Number(
								maxVariantPrice.amount
							).toFixed(2)}`
				return (
					<Tile
						key={node.shopifyId}
						slug={node.handle}
						title={node.title}
						image={node.images[0].localFile.childImageSharp.fluid}
						price={priceRange}
					/>
				)
			})}
		</div>
	</Layout>
)

export const query = graphql`
	{
		allShopifyProduct(sort: { fields: [title] }) {
			edges {
				node {
					title
					shopifyId
					handle
					images {
						localFile {
							childImageSharp {
								fluid(maxWidth: 290, maxHeight: 300) {
									...GatsbyImageSharpFluid_withWebp_tracedSVG
								}
							}
						}
					}
					priceRange {
						minVariantPrice {
							amount
						}
						maxVariantPrice {
							amount
						}
					}
					images {
						originalSrc
					}
				}
			}
		}
	}
`

export default IndexPage
