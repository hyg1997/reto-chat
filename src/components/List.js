import {List as AntList} from "antd";
import styled from "styled-components";

export const List = styled(AntList)`
  margin-top: 1rem;
  height: ${props => props.height || "auto"};
  overflow: scroll;
`;
