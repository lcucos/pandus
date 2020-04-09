/**
 * Summary table
 *   
 * Author: lcucos
 * Date  : March 25 2020
 */


import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';

import './styles.css';


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

//{ id: 'percentDeaths', numeric: true, disablePadding: false, label: '% from Total Deaths' },
const headCells = [
  { id: 'stateName', numeric: false, disablePadding: true, label: 'State' },
  { id: 'population', numeric: true, disablePadding: false, label: 'Population*' },
  { id: 'tested', numeric: true, disablePadding: false, label: 'Tests' },
  { id: 'positive', numeric: true, disablePadding: false, label: 'Positives' },
  { id: 'percentPositiveFromTests', numeric: true, disablePadding: false, label: "Positive % of_Tests" },
  { id: 'deaths', numeric: true, disablePadding: false, label: 'Deaths' },
  { id: 'hospitalized', numeric: true, disablePadding: false, label: 'Hospitalized' },
  { id: 'testsByUnit', numeric: true, disablePadding: false, label: 'Tests @_1_mil' },
  { id: 'positivesByUnit', numeric: true, disablePadding: false, label: 'Positive @_1_mil' },
  { id: 'deathsByUnit', numeric: true, disablePadding: false, label: 'Deaths @_1_mil' },
  { id: 'lastUpdated', numeric: true, disablePadding: false, label: 'Last Update' },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
            size = 'medium'            
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useStyles = makeStyles(theme => ({
  paper: {
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: 1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    
    width: 1,
  },
}));

export default function StatesTable(data) {
  const rows=data.prepData

  const classes = useStyles();
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('positive');
  const [page, setPage] = React.useState(0);
  const [dense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    //   <TableCell align="right">{(row.percentDeaths*100).toFixed(2)+" %"}</TableCell>
    return (
    <div>
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.stateName}
                    >
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row.stateName}
                      </TableCell>
                      <TableCell align="right">{Number(row.population).toLocaleString()}</TableCell>
                      <TableCell align="right">{Number(row.tested).toLocaleString()}</TableCell>
                      <TableCell align="right">{Number(row.positive).toLocaleString()}</TableCell>
                      <TableCell align="right">{(row.percentPositiveFromTests)+" %"}</TableCell>
                      <TableCell align="right">{Number(row.deaths).toLocaleString()}</TableCell>
                      <TableCell align="right">{(row.hospitalized==null?"NA":Number(row.hospitalized).toLocaleString())}</TableCell>
                      <TableCell align="right">{Number(row.testsByUnit).toLocaleString()}</TableCell>
                      <TableCell align="right">{Number(row.positivesByUnit).toLocaleString()}</TableCell>
                      <TableCell align="right">{Number(row.deathsByUnit).toLocaleString()}</TableCell>
                      <TableCell align="right">{row.lastUpdated}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 56]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
    <div align='left' className='recharts-cartesian-axis'>
         <p>* July 2019 population estimate from <a href="https://en.wikipedia.org/wiki/List_of_states_and_territories_of_the_United_States_by_population">States and territories of the United States by population</a>
         </p>
        </div>
    </div>
  );
}
