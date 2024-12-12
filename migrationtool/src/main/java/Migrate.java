
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;

public class Migrate {
    private DataSetCollector dataSetCollector = new DataSetCollector();

    public static void main(String[] args) throws IOException {
        Migrate migrate = new Migrate();
        migrate.migrate();
    }

    private void migrate() {
        try {
            System.out.println("start reading data from geonetwork...this might take a while.");
            var request = HttpRequest.newBuilder()
                    .uri(new URI("https://fairdatafinder.deltares.nl/geonetwork/srv/api/0.1/records?from=1&hitsPerPage=10000&similarity=0.8"))
                    .header("accept", " */*")
                    .header("X-XSRF-TOKEN", "46eed9b9-1888-4014-8bad-7916b09898eb")
                    .GET()
                    .build();
            HttpClient client = HttpClient.newHttpClient();
            HttpResponse<String> response =
                    client.send(request, HttpResponse.BodyHandlers.ofString());
            var mapper = new ObjectMapper();
            String tmpDirsLocation = System.getProperty("java.io.tmpdir");
            File tempFile = new File(tmpDirsLocation, "output.xml");
            try (BufferedWriter writer = new BufferedWriter(new FileWriter(tempFile))) {
                writer.write(response.body());
            }

            DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
            DocumentBuilder db = dbf.newDocumentBuilder();
            Document doc = db.parse(tempFile);
            doc.getDocumentElement().normalize();
            NodeList nodeList = doc.getElementsByTagName("rdf:RDF");
            process(nodeList);
            System.out.println("Data was read successfully, data is exported to " + tempFile);
            var set = dataSetCollector.getDataSets().stream().map(DataSet::getPublisher).collect(Collectors.toSet());

            System.out.println("The following collections will be created" + set);
            for (String collection : set) {
                StringBuilder collectionJson = getCollectionJson();
                String exampleCollection = collectionJson.toString().replaceAll("ExampleCollection", collection.replaceAll(" ", ""));
                int res = postData(exampleCollection, "http://localhost:8082/collections");
                if (res == 409) {
                    System.out.println("Collection " + collection + " does already exists");
                    continue;
                }
                if (res != 200) {
                    System.out.println("Error when uploading " + exampleCollection);
                }
            }

            int count = 0;
            for (DataSet dataSet : dataSetCollector.getDataSets()) {
                var stacDataSet = new StacDataSet(dataSet);
                String json = null;
                try {
                    mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
                    json = mapper.writeValueAsString(stacDataSet);

                    int res = postData(json, "http://localhost:8082/collections/geolab/items");
                    if (res != 201) {
                        System.out.println("Error when uploading " + json);
                    }
                    if ((count % 50)==0) {
                        System.out.println("migrated " + count + " items");
                    }
                    count++;
                } catch (Exception e) {
                    System.out.println(json);
                }
            }
            System.out.println("migration is finished. In total " + count + " items were migrated");

        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    private static int postData(String json, String urlString) throws IOException {
        URL url = new URL(urlString);
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        con.setRequestMethod("POST");
        con.setRequestProperty("Content-Type", "application/json");
        con.setRequestProperty("Accept", "application/json");
        con.setDoOutput(true);
        try (OutputStream os = con.getOutputStream()) {
            byte[] input = json.getBytes(StandardCharsets.UTF_8);
            os.write(input, 0, input.length);
        }
        if (con.getResponseCode() == 409) return 409;
        // Get the response here, get the response here.
        try (BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream(), StandardCharsets.UTF_8))) {
            StringBuilder response = new StringBuilder();
            String responseLine = null;
            while ((responseLine = br.readLine()) != null) {
                response.append(responseLine.trim());
            }
            // This works !
            return con.getResponseCode();
        }
    }

    private StringBuilder getCollectionJson() throws IOException {
        var stream = dataSetCollector.getClass().getClassLoader().getResourceAsStream("Collection.json");
        StringBuilder stringBuilder = new StringBuilder();
        try (BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(stream))) {
            String line = null;
            while ((line = bufferedReader.readLine()) != null) {
                stringBuilder.append(line);
            }
        }
        return stringBuilder;
    }

    private void process(NodeList nodeList) {
        for (int itr = 0; itr < nodeList.getLength(); itr++) {
            Node item = nodeList.item(itr);
            var name = item.getNodeName();
            if (name.equals("dcat:Dataset")) {
                dataSetCollector.createNewDataSet();
            }
            if (name.equals("dc:subject")) {
                dataSetCollector.addSubject(item.getTextContent());
            }
            if (name.equals("dc:title")) {
                dataSetCollector.setTitle(item.getTextContent());
            }
            if (name.equals("dc:creator")) {
                dataSetCollector.setCreator(item.getTextContent());
            }
            if (name.equals("dc:description")) {
                dataSetCollector.setDescription(item.getTextContent());
            }
            if (name.equals("dc:publisher")) {
                dataSetCollector.setPublisher(item.getTextContent());
            }
            if (name.equals("dc:date")) {
                dataSetCollector.setDate(item.getTextContent());
            }
            if (name.equals("dct:modified")) {
                dataSetCollector.setModified(item.getTextContent());
            }
            if (name.equals("dc:format")) {
                dataSetCollector.setFormat(item.getTextContent());
            }
            if (name.equals("dc:source")) {
                dataSetCollector.setSource(item.getTextContent());
            }
            if (name.equals("dc:type")) {
                dataSetCollector.setType(item.getTextContent());
            }
            if (name.equals("dc:language")) {
                dataSetCollector.setLanguage(item.getTextContent());
            }
            if (name.equals("dc:rights")) {
                dataSetCollector.setRights(item.getTextContent());
            }
            if (name.equals("dc:coverage")) {
                dataSetCollector.setCoverage(item.getTextContent());
            }
            process(item.getChildNodes());
        }
    }
}
