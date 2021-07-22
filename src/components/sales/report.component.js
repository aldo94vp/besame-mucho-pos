import React, { useState } from 'react'
import { Document, Page, Text, View, Image, StyleSheet, PDFViewer } from '@react-pdf/renderer';

import Header from 'components/home/header.component';
import { getReportSales } from 'services/sales.service';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff'
  },
  section: {
    margin: 30,
  },
  center: {
    textAlign: 'center',
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    margin: 20,
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTickets: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 530,
  },
  item: {
    flexDirection: 'row',
    marginBottom: 5,
    justifyContent: 'space-between',
    width: 530,
    borderBottom: '0.5px solid #000',
    paddingBottom: 3,
  },
  itemId: {
    fontSize: 12,
  },
  itemTotal: {
    fontSize: 12,
  },
  image: {
    width: 150,
    marginTop: 10,
  },
  footer: {
    margin: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 530,
  }
});

const List = ({children}) => children;

const Item = ({ style, id, total }) => (
  <View style={style ? style : styles.item}>
    <Text style={styles.itemId}>{id}</Text>
    <Text style={styles.itemTotal}>{total}</Text>
  </View>
);
// Create Document Component
const MyDocument = ({items, total, sales, startDate, endDate}) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  console.log(start, end)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image
            style={styles.image}
            src="/logo_transparencia.png"
          />
          <Text>Reporte de ventas</Text>
        </View>
        <View style={styles.section}>
        <Text style={styles.center}>Ventas del {start.toLocaleDateString()} al {end.toLocaleDateString()}</Text>
          <List>
            <Item style={styles.headerTickets} key='header-table' id='Ticket Id' total='Importe'></Item>
            {
              items.map((i, idx) => (
                <Item key={idx} id={i.id} total={i.total}></Item>
              ))
            }
          </List>
        </View>
        <View style={styles.footer}>
          <Text>Nº ventas: {sales}</Text>
          <Text>Total: {total}</Text>
        </View>
      </Page>
    </Document>
)
};


const ReportSales = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [sales, setSales] = useState(0);

  const generateReport = async () => {
    const report = await getReportSales(startDate, endDate);
    const docs = report.docs.map(item => ({id: item.id, total: item.data().total}));
    setItems(docs);
    const tot = docs.reduce((p, c) => (p + c.total), 0);
    setTotal(tot);
    setSales(docs.length);
    setShowReport(true);
  }

  const setDate = (e, isStart = false) => {
    const date = new Date(e.target.value);
    const dateUTC = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()+1,
      isStart ? 0 : 23,
      isStart ? 0 : 59,
      isStart ? 0 : 59,
    )
    console.log(dateUTC)
    isStart ? setStartDate(dateUTC) : setEndDate(dateUTC);
  }

  return (
    <>
      <Header>
        <h1>
          Reporte de Ventas
        </h1>
      </Header>
      <div className="sales-report">
        <div >
          <input type="date" name="startDate" onChange={e => setDate(e, true)} />
          <input type="date" name="endDate" onChange={e => setDate(e)} />
          <button type="button" onClick={generateReport}>Generar reporte</button>
        </div>
        <div>
        {
          showReport && 
            <PDFViewer className="pdf">
              <MyDocument 
                startDate={startDate} 
                endDate={endDate} 
                items={items} 
                total={total} 
                sales={sales} />
            </PDFViewer>
        }
        </div>
      </div>
    </>
  );
};

export default ReportSales;
