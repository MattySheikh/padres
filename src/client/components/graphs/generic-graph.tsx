import * as React from 'react';
import axios from 'axios';
import { LineChart } from '@components/graphs/line-chart';
import { BarChart } from '@components/graphs/bar-chart';
import { PieChart } from '@components/graphs/pie-chart';
import { BoxPlot } from '@components/graphs/box-plot';

export interface State {
	type: string;
	isLoading: Boolean;
	config: Object;
	route: string;
	formatConfig: (data: object[]) => object;
}

const GRAPHS: GenericObject = {
	LineChart,
	BarChart,
	PieChart,
	BoxPlot
};

export class GenericGraph extends React.Component {
	state: State;

	constructor(props: State) {
		super(props);
		this.state = {
			isLoading: true,
			config: {},
			type: props.type,
			route: props.route,
			formatConfig: props.formatConfig
		}
	}

	componentDidMount() {
		this.init();
	}

	public init = () => {
		axios.get(this.state.route).then((response) => {
			const config = this.state.formatConfig(response.data);
			this.setState({
				config,
				isLoading: false
			});
		});
	}

	private getGraph = (): JSX.Element => {
		if (this.state.isLoading) {
			return(<div className="loader"></div>);
		}

		let Component: any = GRAPHS[this.state.type];
		return(<Component {...{config: this.state.config }} />);
	}


	render() {
		return (
			<div className="graph-wrapper">
				<div className="graph-container">
				{this.getGraph()}
				</div>
			</div>
		);
	}
}