import rAFPolyfill from './__test_utils__'
import React from "react";
import jest from "jest";
import Enzyme, { render, shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import toJSON from "enzyme-to-json";

import Floodgate from "floodgate";
import { loopSimulation, theOfficeData } from "helpers";

// configure Enzyme
Enzyme.configure({ adapter: new Adapter() });

// Floodgate isntance
const FloodgateInstance = ({ increment = 3, initial = 3 }) => (
	<Floodgate data={theOfficeData} {...{ increment, initial }}>
		{({ items, loadNext, loadComplete }) => (
			<main>
				{items.map(({ name }) => <p key={name}>{name}</p>)}
				{(!loadComplete && <button onClick={loadNext}>Load More</button>) || (
					<p>All items loaded.</p>
				)}
			</main>
		)}
	</Floodgate>
);

// render Floodgate instances
const enzymeShallowInstance = shallow(
	<Floodgate data={theOfficeData} increment={3}>
		{({ items, loadNext, loadComplete }) => (
			<main>
				{items.map(({ name }) => <p key={name}>{name}</p>)}
				{(!loadComplete && <button onClick={loadNext}>Load More</button>) || (
					<p>All items loaded.</p>
				)}
			</main>
		)}
	</Floodgate>
);

describe("Floodgate", () => {
	// simple check to make sure Floodgate renders
	it("Should render the Floodgate component", () => {
		const fgi = render(<FloodgateInstance />);
		expect(toJSON(fgi)).toMatchSnapshot();
	});

	// test instance has correct children
	it("Should render 3 `p` children and one `button` child", () => {
		const fgi = mount(<FloodgateInstance />);
		expect(fgi.find("p").length).toBe(3);
		expect(fgi.find("button").length).toBe(1);
		expect(toJSON(fgi)).toMatchSnapshot();
	});

	// test instance's children's text values
	it("Should render `p` children that have text matching [Jim Halpert,Pam Halpert,Ed Truck]", () => {
		const testTextValues = ["Jim Halpert", "Pam Halpert", "Ed Truck"];
		const renderedParagraphTextValues = [];
		const fgi = mount(<FloodgateInstance />);
		fgi.find("p").forEach(p => {
			renderedParagraphTextValues.push(p.text());
		});
		expect(renderedParagraphTextValues).toMatchObject(testTextValues);
	});

	// test instance renders non-default lengths of initial
	it("Should render with 4 `p` children", () => {
		const fgi = mount(<FloodgateInstance initial={4} />);
		expect(fgi.find("p").length).toBe(4);
		expect(toJSON(fgi)).toMatchSnapshot();
	});

	// test instance loads new items
	it("Should render with 3 `p` children and load 3 `p` children `onClick()`", () => {
		const fgi = mount(<FloodgateInstance />);
		expect(fgi.find("p").length).toBe(3);
		expect(toJSON(fgi)).toMatchSnapshot();

		// simulate click
		fgi.find("button").simulate("click");
		expect(fgi.find("p").length).toBe(6);
		expect(toJSON(fgi)).toMatchSnapshot();
	});
	// test instance loads different lengths of increment
	it("Should render with 2 `p` children and load 1 `p` children `onClick()`", () => {
		const fgi = mount(<FloodgateInstance initial={2} increment={1} />);
		const button = fgi.find("button");
		const p = (prop = false) => (prop ? fgi.find("p")[prop] : fgi.find("p"));
		expect(p("length")).toBe(2);
		expect(toJSON(fgi)).toMatchSnapshot();

		// simulate click
		button.simulate("click");
		expect(p("length")).toBe(3);
		expect(toJSON(fgi)).toMatchSnapshot();

		loopSimulation(2, () => button.simulate("click"));
		expect(p("length")).toBe(5);
		expect(fgi.find("button").length).toBe(1);
		expect(toJSON(fgi)).toMatchSnapshot();

		loopSimulation(3, () => button.simulate("click"));
		expect(p("length")).toBe(8);
		expect(
			p()
				.last()
				.text()
		).toMatch("All items loaded.");
		expect(fgi.find("button").length).toBe(0);
		expect(toJSON(fgi)).toMatchSnapshot();
	});
});
