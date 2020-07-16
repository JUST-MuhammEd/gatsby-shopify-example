import React, { useState, useEffect, useContext } from 'react'
import Client from 'shopify-buy'
const SHOPIFY_CHECKOUT_STORAGE_KEY = 'shopify_checkout_id'

const client = Client.buildClient({
	storefrontAccessToken: process.env.SHOP_TOKEN,
	domain: `${process.env.SHOP_NAME}.myshopify.com`
})

const initialStoreState = {
	client,
	isAdding: false,
	checkout: { lineItems: [] }
}

const StoreContext = React.createContext({
	store: initialStoreState,
	setStore: () => null
})

const createNewCheckout = (store) => {
	return store.checkout.create()
}

const fetchCheckout = (store, id) => {
	return store.client.checkout.fetch(id)
}

const setCheckoutInState = (checkout, setStore) => {
	const isBrowser = typeof window !== 'undefined'
	if (isBrowser) {
		localStorage.setItem(SHOPIFY_CHECKOUT_STORAGE_KEY, checkout.id)
	}

	setStore((prevState) => {
		return { ...prevState, checkout }
	})
}

const StoreContextProvider = ({ children }) => {
	const [ store, setStore ] = useState(initialStoreState)

	useEffect(() => {
		const initializeCheckout = async () => {
			// Check for an existing cart.
			const isBrowser = typeof window !== 'undefined'
			const existingCheckoutId = isBrowser
				? localStorage.getItem(SHOPIFY_CHECKOUT_STORAGE_KEY)
				: null

			if (existingCheckoutId) {
				try {
					const checkout = await fetchCheckout(client, existingCheckoutId)
					// Make sure this cart hasn’t already been purchased.
					if (!checkout.completedAt) {
						setCheckoutInState(checkout, setStore)
						return
					}
				} catch (e) {
					localStorage.setItem(SHOPIFY_CHECKOUT_STORAGE_KEY, null)
				}
			}

			const newCheckout = await createNewCheckout(client)
			setCheckoutInState(newCheckout, setStore)
		}

		initializeCheckout()
	}, [])

	return (
		<StoreContext.Provider
			value={{
				store,
				setStore
			}}
		>
			{children}
		</StoreContext.Provider>
	)
}

const useStore = () => {
	const { store } = useContext(StoreContext)
	return store
}

const useCartCount = () => {
	const { store: { checkout } } = useContext(StoreContext)

	const count = checkout.lineItems.reduce(
		(runningTotal, item) => item.quantity + runningTotal,
		0
	)

	return count
}

const useCartTotals = () => {
	const { store: { checkout } } = useContext(StoreContext)

	const tax = checkout.totalTaxV2
		? `R${Number(checkout.totalTaxV2.amount).toFixed(2)}`
		: '-'
	const total = checkout.totalPriceV2
		? `R${Number(checkout.totalPriceV2.amount).toFixed(2)}`
		: '-'

	return {
		tax,
		total
	}
}

const useCartItems = () => {
	const { store: { checkout } } = useContext(StoreContext)

	return checkout.lineItems
}

const useAddItemToCart = () => {
	const { store: { checkout, client }, setStore } = useContext(StoreContext)

	const addItemToCart = async (variantId, quantity) => {
		if (variantId === '' || !quantity) {
			console.error('Both a size and quantity are required.')
			return
		}

		setStore((prevState) => {
			return { ...prevState, isAdding: true }
		})

		const checkoutId = checkout.id

		const lineItemsToAdd = [ { variantId, quantity: parseInt(quantity, 10) } ]

		const newCheckout = await client.checkout.addLineItems(checkoutId, lineItemsToAdd)

		setStore((prevState) => {
			return { ...prevState, checkout: newCheckout, isAdding: false }
		})
	}

	return addItemToCart
}

const useRemoveItemFromCart = () => {
	const { store: { client, checkout }, setStore } = useContext(StoreContext)

	const removeItemFromCart = async (itemId) => {
		const newCheckout = await client.checkout.removeLineItems(checkout.id, [ itemId ])

		setStore((prevState) => {
			return { ...prevState, checkout: newCheckout }
		})
	}

	return removeItemFromCart
}

const useCheckout = () => {
	const { store: { checkout } } = useContext(StoreContext)

	return () => {
		window.open(checkout.webUrl)
	}
}

export {
	StoreContextProvider,
	useAddItemToCart,
	useStore,
	useCartCount,
	useCartItems,
	useCartTotals,
	useRemoveItemFromCart,
	useCheckout
}
