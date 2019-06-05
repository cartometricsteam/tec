import React from 'react'
import legendData from './assets/data/legend.json'

const style = {
  card: {
  	position: 'absolute',
  	bottom: '40px',
  	left: '10px',
  	height: '250px',
    width: '300px',
  	backgroundColor: 'white',
  	zIndex: '10',
  	overflowY: 'scroll'
  },
  cardHeader: {
  	alignItems: 'center'
  },
  cardHeaderTitle: {
  	padding: '5px 0',
  	color: '#00aec7',
  	fontSize: '1rem'
  },
  delete: {
  	marginRight: '5px'
  },
  cardContent: {
  	padding: '10px 20px'
  },
  legendRow: {
  	margin: '3px 0',
  	display: 'flex',
  	alignItems: 'center'
  },
  icon: {
    height: '20px',
    width: '20px',
    marginRight: '10px'
  },
  name: {
  	fontSize: '.8rem'
  }
}

export default function Legend(props) {
  if (props.visible) {
  	return(
			<div style={style.card}>
				<div style={style.cardHeader}>
					<p style={style.cardHeaderTitle}>LEYENDA</p>
					<button type='button' className='close' aria-label='Close' onClick={() => {}}><span aria-hidden='true'>&times;</span></button>
				</div>
				<div className="card-content" style={style.cardContent}>
					{legendData.themes.map(theme => (
						<div style={style.legendRow} key={theme.name}>
							<span style={style.name}>{theme.name}</span>
              {/*<span style={style.name}>{theme.description}</span>*/}
						</div>
					))}
				</div>
			</div>
  	);
  } else {
  	return null;
  }
}