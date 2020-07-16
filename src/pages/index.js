import React from 'react'
import { Link } from 'gatsby'

import Layout from '../components/layout'
import Image from '../components/image'
import SEO from '../components/seo'

const IndexPage = ({ data }) => (
	<Layout>
		<SEO title="Home" />
		<h1>Products</h1>
		<ul>
			{data.allShopifyProduct.edges.map(({ node }) => (
				<Link
					style={{ color: 'black', textDecoration: 'none' }}
					to={`/product/${node.handle}`}
					key={node.shopifyId}
				>
					<li style={{ listStyle: 'none', border: '2px solid black', padding: '10px' }}>
						<h3>{node.title}</h3>
						<p>
							R{node.priceRange.minVariantPrice.amount} - R{node.priceRange.maxVariantPrice.amount}
						</p>
					</li>
				</Link>
			))}
		</ul>
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
