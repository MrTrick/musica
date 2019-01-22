import React from "react";
import ReactDOM from "react-dom";

import InputSearch from "./InputSearch";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<InputSearch value="" handleChange={() => {}} />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('Inserts "value" into the component, clear icon appears', () => {
  const wrapper = mount(
    <InputSearch value="" handleChange={() => {}} />
  );
  expect(wrapper).toMatchSnapshot();
  expect(wrapper.find('input').prop('value')).toBe('');
  expect(wrapper.find('ClearIcon')).toHaveLength(0);

  wrapper.setProps({value: "Rap"});
  expect(wrapper).toMatchSnapshot();
  expect(wrapper.find('input').prop('value')).toBe('Rap');
  expect(wrapper.find('ClearIcon')).toHaveLength(1);
});

it('Calls "handleChange" when the input content changes, or the "clear" button is clicked.', () => {
  const onChangeMock = jest.fn();
  const wrapper = mount(
    <InputSearch value="oldvalue" handleChange={onChangeMock} />
  );
  const event = { target: { value: 'newvalue' } };
  wrapper.find('input').simulate('change', event);
  expect(onChangeMock).toBeCalledWith('newvalue');

  const clear = wrapper.find('ClearIcon');
  clear.simulate('click');
  expect(onChangeMock).toBeCalledWith('');
});
