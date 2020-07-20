import React, { useMemo, useState, useEffect } from 'react'
import Layout from '../components/layout'
import SEO from '../components/seo'
import Img from 'gatsby-image'
import { graphql } from 'gatsby'
import { prepareVariantsWithOptions } from './utilities'
import { useAddItemToCart } from '../context/StoreContext'

const ProductTemplate = ({ data }) => {
	const product = data.shopifyProduct

	const variants = useMemo(() => prepareVariantsWithOptions(product.variants), [
		product.variants
	])
	const colors = variants[0].color
		? product.options.find((option) => option.name.toLowerCase() === 'color').values
		: null
	const sizes = variants[0].size
		? product.options.find((option) => option.name.toLowerCase() === 'size').values
		: null

	const addItemToCart = useAddItemToCart()
	const [ variant, setVariant ] = useState(variants[0])
	const [ color, setColor ] = useState(variant.color)
	const [ size, setSize ] = useState(variant.size)

	useEffect(
		() => {
			const newVariant = variants.find((variant) => {
				return variant.size === size && variant.color === color
			})

			if (variant.shopifyId !== newVariant.shopifyId) {
				setVariant(newVariant)
			}
		},
		[ size, color, variants, variant.shopifyId ]
	)

	const handleAddToCart = () => {
		addItemToCart(variant.shopifyId, 1)
		alert('🛒 Added to your cart!')
	}

	return (
		<Layout>
			<SEO title={product.title} />
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(4, 1fr)',
					gridGap: '20px'
				}}
			>
				<div
					style={{
						border: '2px solid black',
						padding: 5,
						gridColumn: '1/3',
						gridRow: '1/5',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center'
					}}
				>
					<Img fluid={variant.image.localFile.childImageSharp.fluid} />
				</div>
				<h1 style={{ gridColumn: '3/5' }}>{product.title}</h1>
				<div style={{ gridColumn: '3/5' }}>{product.description}</div>
				<strong style={{ gridColumn: '3/5', fontSize: '1.3rem' }}>
					Price: R{variant.price}
				</strong>
				{variants.length > 1 ? (
					<div style={{ gridColumn: '3/5' }}>
						<label style={{ marginRight: 10 }} htmlFor="colors">
							Colours:{' '}
							<select
								id="colors"
								onChange={(event) => setColor(event.target.value)}
							>
								{colors.map((color) => (
									<option value={color}>{color}</option>
								))}
							</select>
						</label>
						<label style={{ margin: 10 }} htmlFor="sizes">
							Sizes:{' '}
							<select
								id="sizes"
								onChange={(event) => setSize(event.target.value)}
							>
								{sizes.map((size) => (
									<option value={size}>{size}</option>
								))}
							</select>
						</label>
					</div>
				) : (
					''
				)}

				<button style={{ gridColumn: '3/5' }} onClick={handleAddToCart}>
					Add to cart
				</button>
			</div>
		</Layout>
	)
}

export const query = graphql`
	query($handle: String!) {
		shopifyProduct(handle: { eq: $handle }) {
			id
			title
			handle
			productType
			description
			descriptionHtml
			shopifyId
			options {
				id
				name
				values
			}
			variants {
				id
				title
				price
				availableForSale
				shopifyId
				selectedOptions {
					name
					value
				}
				image {
					localFile {
						childImageSharp {
							fluid {
								...GatsbyImageSharpFluid_withWebp_tracedSVG
							}
						}
					}
				}
			}
			priceRange {
				minVariantPrice {
					amount
					currencyCode
				}
				maxVariantPrice {
					amount
					currencyCode
				}
			}
		}
	}
`

export default ProductTemplate
