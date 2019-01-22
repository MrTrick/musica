import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer";
import Logo from "./Logo";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Logo />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it("looks like a logo should", () => {
  const component = renderer.create(<Logo />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
