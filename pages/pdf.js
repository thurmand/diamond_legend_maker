import ReactPDF, {
  Page,
  Text,
  View,
  Document,
  PDFViewer,
} from "@react-pdf/renderer";

function PreviewPDF() {
  return (
    <Document>
      <Page size="A4" style={{ padding: 16, backgroundColor: "white" }}>
        <View>
          <View
            style={{
              margin: 10,
              padding: 10,
            }}
          >
            {/* <Text>{data.projectName}</Text> */}
          </View>
          <View
            style={{
              margin: 10,
              padding: 10,
            }}
          >
            {/* {data.symbolList.map((n) => (
              <Text style={{ paddingRight: 12 }}>{n.dmc}</Text>
            ))} */}
          </View>
          <View
            style={{
              margin: 10,
              padding: 10,
            }}
          >
            {/* {data.symbolList.map((n) => (
              <ColorBlock
                symbol={n.symbol}
                color={n.hex}
                textColor={n.textColor}
                profile={data.profile}
              />
            ))} */}
          </View>
        </View>
      </Page>
    </Document>
  );
}

ReactPDF.render(<PreviewPDF />);
