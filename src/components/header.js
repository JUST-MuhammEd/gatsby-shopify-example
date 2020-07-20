import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import { useCartCount } from '../context/StoreContext'

const Header = ({ siteTitle }) => {
	const count = useCartCount()
	return (
		<header
			style={{
				background: `rebeccapurple`,
				marginBottom: `1.45rem`
			}}
		>
			<div
				style={{
					display: `flex`,
					margin: `0 auto`,
					maxWidth: 960,
					padding: `1.45rem 1.0875rem`,
					justifyContent: `space-between`
				}}
			>
				<h1 style={{ margin: 0 }}>
					<Link
						to="/"
						style={{
							color: `white`,
							textDecoration: `none`
						}}
					>
						{siteTitle}
					</Link>
				</h1>
				<Link
					to="/cart"
					style={{
						color: `white`,
						textDecoration: `none`
					}}
				>
					<span role="img" aria-label="Cart">
						🛒
					</span>Cart: {count}
				</Link>
			</div>
		</header>
	)
}

Header.propTypes = {
	siteTitle: PropTypes.string
}

Header.defaultProps = {
	siteTitle: ``
}

export default Header
