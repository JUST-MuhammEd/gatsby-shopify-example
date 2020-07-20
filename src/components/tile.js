import React from 'react'
import Img from 'gatsby-image'
import { useStaticQuery, graphql, Link } from 'gatsby'

const Tile = ({ title, slug, price, image }) => {
	return (
		<Link
			to={`/product/${slug}`}
			style={{
				maxWidth: 275,
				p: 5,
				display: 'flex',
				flexDirection: 'column',
				textDecoration: 'none',
				color: 'black'
			}}
		>
			<div style={{ position: 'relative' }}>
				<Img fluid={image} />
			</div>
			<h2 style={{ marginTop: 4, marginBottom: 0, fontSize: 20 }}>{title}</h2>
			<p>{price}</p>
		</Link>
	)
}

export default Tile
