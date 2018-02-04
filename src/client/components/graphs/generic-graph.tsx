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
		_.forOwn(filters, (options, filterKey) => {
			_.forOwn(options.types, (filter, key) => {
				if (options.multiple) {
					built[filterKey] = built[filterKey] || [];
				}
				if (filter.selected) {
					if (options.multiple) {
						built[filterKey].push(key);
					} else {
						built[filterKey] = key;
					}
				}
			})
		});

		return `?${queryString.stringify(built)}`;
	}

	private getGraph = (): JSX.Element => {
		if (this.state.isLoading) {
			return(<div className="loader-container"><div className="loader"></div></div>);
		}

		let Component: any = GRAPHS[this.state.type];
		return(
			<div>
				<Component {...{config: this.state.config }} />
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
		_.forOwn(filters, (options, filterKey) => {
			if (!options.selectable) return;
			let selected: string | string[] = _.keys(_.pickBy(options.types, { selected: true } as any));
			selected = options.multiple ? selected : selected[0];

			boxes.push(
				<select value={selected} key={filterKey} name={filterKey} onChange={this.handleChange} multiple={options.multiple}>
					{this.getFilterItems(options.types)}
				</select>
			);
		});

		return boxes;
	}

	private getFilterItems = (types: object): JSX.Element[] => {
		const items: JSX.Element[] = [];
		_.forOwn(types, (filter, key) => {
			items.push(
				<option key={key} value={key}>
					{filter.label}
				</option>
			);
		});

		return items;
	}

	private handleChange = (e: any) => {
		let parentKey = e.target.name;
		const filters: any = _.cloneDeep(this.state.filters);


		// Set everything to false then get the selected
		const options = e.target.options;
		const selected = [];
		const length = options.length;
		_.mapValues(filters[parentKey].types, (f: any) => f.selected = false);
		for (let i = 0; i < length; i++) {
			if (options[i].selected) {
				selected.push(options[i].value);
			}
		}

		_.map(selected, (s) => filters[parentKey].types[s].selected = true);
		this.setState({ filters }, this.build);
	}


	render() {
		return (
			<div className="graph-wrapper">
					{this.getGraph()}
					{this.buildFilter(this.state.filters)}
			</div>
		);
	}
}