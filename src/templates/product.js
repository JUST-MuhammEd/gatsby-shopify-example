import React, { useMemo, useState, useEffect } from 'react'
import Layout from '../components/layout'
import SEO from '../components/seo'
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
			<h1>{product.title}</h1>
			<div>{product.description}</div>
			{variants.length > 1 ? (
				<div>
					<label htmlFor="colors">Colours: </label>
					<select
						id="colors"
						onChange={(event) => setColor(event.target.value)}
					>
						{colors.map((color) => <option value={color}>{color}</option>)}
					</select>
				</div>
			) : (
				''
			)}
			{variants.length > 1 ? (
				<div>
					<label htmlFor="sizes">Sizes: </label>
					<select id="sizes" onChange={(event) => setSize(event.target.value)}>
						{sizes.map((size) => <option value={size}>{size}</option>)}
					</select>
				</div>
			) : (
				''
			)}

			<p>Price: R{variant.price}</p>

			<button onClick={handleAddToCart}>Add to cart</button>
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
