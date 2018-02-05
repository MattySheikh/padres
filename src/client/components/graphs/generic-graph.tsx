/**
 * Handles the graph to be rendered in addition to applying filters and sending the request for data
 */

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


	/**
	 * Fetches the data and applies the initial state
	 *
	 * @returns {undefined}
	 */
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

	/**
	 * Prepares the request query by applying filters to the query string
	 *
	 * @param {GenericObject} filters
	 *
	 * @returns {string} - the query search params to be attached to the route
	 */
	private prepQuery = (filters: GenericObject) => {
		const built: GenericObject = {};
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

	/**
	 * Looks up which graph to use based on type and renders either that or a loading circle
	 *
	 * @returns {JSX.Element}
	 */
	private getGraph = (): JSX.Element => {
		if (this.state.isLoading) {
			return(<div className="loader-container"><div className="loader"></div></div>);
		}

		let Component = GRAPHS[this.state.type];
		return(
			<div>
				<Component {...{config: this.state.config }} />
			</div>
		);
	}

	/**
	 * Builds the filters container
	 *
	 * @param {object} filters
	 *
	 * @returns {JSX.Element}
	 */
	private buildFilter = (filters: object): JSX.Element => {
		return(
			<div className="filter-container">
				{this.getSelectBoxes(filters)}
			</div>
		);
	};

	/**
	 * Creates actual select objects for a filter dropdown/multiselect
	 *
	 * @param {object} filters
	 *
	 * @returns {JSX.Element[]}
	 */
	private getSelectBoxes = (filters: object): JSX.Element[] => {
		const boxes: JSX.Element[] = [];
		_.forOwn(filters, (options, filterKey) => {
			if (!options.selectable) return;
			let selected: string | string[] = _.keys(_.pickBy(options.types, { selected: true } as GenericObject));
			selected = options.multiple ? selected : selected[0];

			boxes.push(
				<div key={filterKey} className='filter'>
					<select value={selected} name={filterKey} onChange={this.handleChange} multiple={options.multiple}>
						{this.getFilterItems(options.types)}
					</select>
				</div>
			);
		});

		return boxes;
	}

	/**
	 * Creates options for a filter dropdown/multiselect
	 *
	 * @param {object} types - different options of a filter
	 *
	 * @returns {JSX.Element[]}
	 */
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

	/**
	 * Handles a filter change and triggers a rebuild of the graph after setting state
	 *
	 * @param {object} e - this is an event type but TypeScript has beef when you try to modify the
	 * target of an event so we're going to use a generic object for now
	 *
	 * @returns {JSX.Element[]}
	 */
	private handleChange = (e: GenericObject) => {
		let parentKey = e.target.name;
		const filters: GenericObject = _.cloneDeep(this.state.filters);


		// Set everything to false then get the selected
		const options = e.target.options;
		const selected = [];
		const length = options.length;
		_.mapValues(filters[parentKey].types, (f: { selected: boolean }) => f.selected = false);
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