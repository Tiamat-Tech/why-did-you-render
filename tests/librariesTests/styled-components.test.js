 
import React from 'react';
import styled from 'styled-components/dist/styled-components.js';
import * as rtl from '@testing-library/react';

import whyDidYouRender from '~';
import {diffTypes} from '~/consts';

let updateInfos = [];
beforeEach(() => {
  updateInfos = [];
  whyDidYouRender(React, {
    notifier: updateInfo => updateInfos.push(updateInfo),
  });
});

afterEach(() => {
  React.__REVERT_WHY_DID_YOU_RENDER__();
});

test('simple styled-components', () => {
  const InnerComponent = () => <div>foobar</div>;
  const StyledInnerComponent = styled(InnerComponent)``;

  StyledInnerComponent.whyDidYouRender = true;

  const {rerender} = rtl.render(
    <StyledInnerComponent a={[]}/>
  );
  rerender(
    <StyledInnerComponent a={[]}/>
  );

  expect(updateInfos).toHaveLength(1);
  expect(updateInfos[0].reason).toEqual({
    propsDifferences: [{
      pathString: 'a',
      diffType: diffTypes.deepEquals,
      prevValue: [],
      nextValue: [],
    }],
    stateDifferences: false,
    hookDifferences: false,
    ownerDifferences: false,
  });
});

test('styled-components wrap of a memoized component', () => {
  const InnerComponent = React.memo(() => <div>foobar</div>);
  const StyledInnerComponent = styled(InnerComponent)``;

  StyledInnerComponent.whyDidYouRender = true;

  const {rerender} = rtl.render(
    <StyledInnerComponent a={[]}/>
  );
  rerender(
    <StyledInnerComponent a={[]}/>
  );

  expect(updateInfos).toHaveLength(1);
  expect(updateInfos[0].reason).toEqual({
    propsDifferences: [{
      pathString: 'a',
      diffType: diffTypes.deepEquals,
      prevValue: [],
      nextValue: [],
    }],
    stateDifferences: false,
    hookDifferences: false,
    ownerDifferences: false,
  });
});

test('styled-components with forward ref', () => {
  const InnerComponent = React.forwardRef((props, ref) =>
    <div ref={ref}>foobar</div>
  );

  const Styled = styled(InnerComponent)``;

  Styled.whyDidYouRender = true;

  const Wrapper = (props) => {
    const ref = React.useRef(null);
    return <Styled {...props} ref={ref} />;
  };

  const {rerender} = rtl.render(
    <Wrapper a={[]}/>
  );
  rerender(
    <Wrapper a={[]}/>
  );

  expect(updateInfos).toHaveLength(1);
  expect(updateInfos[0].reason).toEqual({
    propsDifferences: [{
      pathString: 'a',
      diffType: diffTypes.deepEquals,
      prevValue: [],
      nextValue: [],
    }],
    stateDifferences: false,
    hookDifferences: false,
    ownerDifferences: {
      hookDifferences: false,
      propsDifferences: [{
        pathString: 'a',
        diffType: diffTypes.deepEquals,
        prevValue: [],
        nextValue: [],
      }],
      stateDifferences: false,
    },
  });
});

test('styled-components with memoized forward ref', () => {
  const InnerComponent = React.memo(
    React.forwardRef((props, ref) =>
      <div ref={ref}>foobar</div>
    )
  );

  const StyledInnerComponent = styled(InnerComponent)``;

  StyledInnerComponent.whyDidYouRender = true;

  const Wrapper = (props) => {
    const ref = React.useRef(null);
    return <StyledInnerComponent {...props} ref={ref} />;
  };

  const {rerender} = rtl.render(
    <Wrapper a={[]}/>
  );
  rerender(
    <Wrapper a={[]}/>
  );

  expect(updateInfos).toHaveLength(1);
  expect(updateInfos[0].reason).toEqual({
    propsDifferences: [{
      pathString: 'a',
      diffType: diffTypes.deepEquals,
      prevValue: [],
      nextValue: [],
    }],
    stateDifferences: false,
    hookDifferences: false,
    ownerDifferences: {
      hookDifferences: false,
      propsDifferences: [{
        pathString: 'a',
        diffType: diffTypes.deepEquals,
        prevValue: [],
        nextValue: [],
      }],
      stateDifferences: false,
    },
  });
});
