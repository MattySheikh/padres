import * as React from 'react';
import axios from 'axios';
import * as queryString from 'query-string';
import { LineChart } from '@components/graphs/line-chart';
import { BarChart } from '@components/graphs/bar-chart';
import { PieChart } from '@components/graphs/pie-chart';
import { BoxPlot } from '@components/graphs/box-plot';
import { ScatterPlot } from '@components/graphs/scatter-plot';

export interface State {
	type: string;
	isLoading: Boolean;
	config: Object;
	route: string;
	formatConfig: (data: object[]) => object;
	filters: object;
}

const GRAPHS: GenericObject = {
	LineChart,
	BarChart,
	PieChart,
	BoxPlot,
	ScatterPlot
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
			formatConfig: props.formatConfig,
			filters: props.filters
		}
	}

	componentDidMount() {
		this.build();
	}


	public build = () => {
		const route = `${this.state.route}${this.prepQuery(this.state.filters)}`;
		this.setState({ isLoading: true})
		axios.get(route).then((response) => {
			const config = this.state.formatConfig(response.data);
			this.setState({
				config,
				isLoading: false
			});
		});
	}

	private prepQuery = (filters: GenericObject) => {
		const built: any = {};
		_.forOwn(filters, (filterTypes, filterKey) => {
			_.forOwn(filterTypes, (filter, key) => {
				if (filter.selected) {
					built[filterKey] = key;
				}
			})
		});

		return `?${queryString.stringify(built)}`;
	}

	private getGraph = (): JSX.Element => {
		if (this.state.isLoading) {
			return(<div className="loader"></div>);
		}

		let Component: any = GRAPHS[this.state.type];
		return(
			<div>
				<Component {...{config: this.state.config }} />
				{this.buildFilter(this.state.filters)}
			</div>
		);
	}

	private buildFilter = (filters: object): JSX.Element => {
		return(
			<div className="filter-container">
				{this.getSelectBoxes(filters)}
			</div>
		);
	};

	private getSelectBoxes = (filters: object): JSX.Element[] => {
		const boxes: JSX.Element[] = [];
		_.forOwn(filters, (filterTypes, filterKey) => {
			boxes.push(
				<select onChange={this.handleChange}>
					{this.getFilterItems(filterTypes, filterKey)}
				</select>
			);
		});

		return boxes;
	}

	private getFilterItems = (types: object, parentKey: string): JSX.Element[] => {
		const items: JSX.Element[] = [];
		_.forOwn(types, (filter, key) => {
			items.push(
				<option selected={filter.selected} value={`${key}:${parentKey}`}>
					{filter.label}
				</option>
			);
		});

		return items;
	}

	private handleChange = (e: any) => {
		let parentFilter;
		let key;
		[key, parentFilter] = e.target.value.split(':');
		// Set the selected to false
		const filters: any = _.cloneDeep(this.state.filters);
		_.mapValues(filters[parentFilter], (f: any) => f.selected = false);
		filters[parentFilter][key].selected = true;
		this.state.filters = filters;
		this.build();
	}


	render() {
		return (
			<div className="graph-wrapper">
					{this.getGraph()}
			</div>
		);
	}
}