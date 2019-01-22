import React from "react";
import ReactDOM from "react-dom";

import Loading from "./Loading";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Loading />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it("looks like a loading element should", () => {
  const wrapper = shallow(
    <Loading />
  );
  expect(wrapper).toMatchSnapshot();
});
