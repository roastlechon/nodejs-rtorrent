// /** @jsx React.DOM */
// function TableRowComponent($filter) {
//   return React.createClass({
//     displayName: 'tableRow',
//     render: function() {
//       var data = this.props.data;

//       var torrentNameStyle = {
//         width: '420',
//         whiteSpace: 'nowrap',
//         overflow: 'hidden',
//         textOverflow: 'ellipsis'
//       };

//       var torrentStatusStyle = {
//         width: '130'
//       };

//       var torrentBytesStyle = {
//         width: '90'
//       };

//       return <tr className={'torrent'} data-index={data.index}>
//     <td>
//       <h5 title={data.name} style={torrentNameStyle}>{data.name}</h5>
//     </td>
//     <td>{data.status}</td>
//     <td><div>$filter('bytes')(data.size)</div></td>
//     <td>
//       <div className="progress">
//         <div className="progress-bar" ></div>
//       </div>
//     </td>
//     <td><div ></div></td>
//     <td><div ></div></td>
//     <td><div ></div></td>
//     <td><div ></div></td>
//     <td><div ></div></td>
//     <td><div ></div></td>
//     <td><div></div></td>
//   </tr>;
//     }
//   });
// }



// angular.module('app')
//   .factory('TableRowComponent', TableRowComponent);
