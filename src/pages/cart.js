import React from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../components/layout'
import SEO from '../components/seo'
import {
	useCartItems,
	useCartTotals,
	useAddItemToCart,
	useRemoveItemFromCart,
	useCheckout
} from '../context/StoreContext'

const CartPage = ({ data }) => {
	const products = data.allShopifyProduct.nodes

	const lineItems = useCartItems()
	const { tax, total } = useCartTotals()
	const removeFromCart = useRemoveItemFromCart()
	const checkout = useCheckout()

	const betterProductHandles = products.map(({ handle, variants }) => {
		const newVariants = variants.map((variant) => variant.shopifyId)
		return {
			variants: newVariants,
			handle
		}
	})

	const getHandleForVariant = (variantId) => {
		const selectedProduct = betterProductHandles.find((product) => {
			return product.variants.includes(variantId)
		})

		return selectedProduct ? selectedProduct.handle : null
	}

	const LineItem = ({ item }) => (
		<div
			style={{
				display: 'grid',
				gridGap: '10px',
				gridTemplateColumns: '3fr 5fr 2fr 2fr'
			}}
		>
			<div style={{ border: '2px solid black', padding: '1px' }}>
				<p>Something</p>
			</div>
			<div>
				<Link to={`/product/${getHandleForVariant(item.variant.id)}`}>
					{item.title}
				</Link>
				<ul style={{ listStyle: 'none' }}>
					{item.variant.selectedOptions.map(({ name, value }) => (
						<li key={name}>
							<strong>{name}: </strong>
							{value}
						</li>
					))}
					<li key="quantity">
						<strong>Quantity: </strong>
						{item.quantity}
					</li>
				</ul>
			</div>
			<span>R{Number(item.variant.priceV2.amount).toFixed(2)}</span>
			<button onClick={() => removeFromCart(item.id)}>Delete</button>
		</div>
	)

	const emptyCart = (
		<Layout>
			<SEO title="Cart" />
			<h1>Cart</h1>
			<p>Your shopping cart is empty.</p>
		</Layout>
	)

	return lineItems < 1 ? (
		emptyCart
	) : (
		<Layout>
			<SEO title="Cart" />
			<h1>Cart</h1>
			{lineItems.map((item) => (
				<React.Fragment key={item.id}>
					<LineItem key={item.id} item={item} />
					<br />
				</React.Fragment>
			))}
			<br />
			<h3>Total: {total}</h3>
			<button onClick={checkout}>Checkout</button>
		</Layout>
	)
}

export default CartPage

export const query = graphql`
	{
		allShopifyProductVariant {
			nodes {
				shopifyId
			}
		}
		allShopifyProduct {
			nodes {
				handle
				variants {
					shopifyId
				}
			}
		}
	}
`
