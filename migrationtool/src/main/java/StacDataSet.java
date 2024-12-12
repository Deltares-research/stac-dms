import java.util.List;

public class StacDataSet {
    private String id = String.valueOf(System.nanoTime());
    private final Properties properties;
    private String type = "Feature";
    private String stac_version = "1.0.0";
    private List<String> stac_extensions = List.of("https://stac-extensions.github.io/eo/v1.0.0/schema.json", "https://stac-extensions.github.io/projection/v1.0.0/schema.json");
    private Geometry geometry;
    private double[] bbox;
    private String collection;
    private Assets assets = new Assets();
    private String[] links = new String[0];

    public String getId() {
        return id;
    }

    public String[] getLinks() {
        return links;
    }

    public Assets getAssets() {
        return assets;
    }

    public StacDataSet(DataSet dataSet) {
        this.collection = dataSet.getPublisher().replaceAll(" ", "");
        properties = new Properties();
        if (dataSet.getDate().length() != 10) {
            properties.setDatetime(dataSet.getDate());
        } else {
            properties.setDatetime(dataSet.getDate() + "T00:00:00Z");

        }
        if (dataSet.getModified() != null) {
            if (dataSet.getModified().endsWith("Z")) {
                properties.setUpdated(dataSet.getModified());
            } else {
                properties.setUpdated(dataSet.getModified() + "Z");

            }
        }
        properties.setKeywords(dataSet.getSubjects().toArray(String[]::new));
        properties.setDescription(dataSet.getDescription());
        properties.setTitle(dataSet.getTitle());
        properties.setCreator(dataSet.getCreator());
        properties.setLanguage(dataSet.getLanguage());
        properties.setRights(dataSet.getRights());
        properties.setSource(dataSet.getSource());
        properties.setType(dataSet.getType());
        properties.setPublisher(dataSet.getPublisher());
        properties.setFormat(dataSet.getFormat());
        if (dataSet.getCoverage() != null) {
            String[] splittedCoverage = dataSet.getCoverage().split(", ");
            double north = Double.parseDouble(splittedCoverage[0].split(" ")[1]);
            double south = Double.parseDouble(splittedCoverage[1].split(" ")[1]);
            double east = Double.parseDouble(splittedCoverage[2].split(" ")[1]);
            String value = splittedCoverage[3].split(" ")[1];
            if (value.endsWith(".")) {
                value = value.substring(0, value.length() - 1);
            }
            double west = Double.parseDouble(value);
            double[][] values = new double[4][];
            values[0] = new double[2];
            values[0][0] = north;
            values[0][1] = east;
            values[1] = new double[2];
            values[1][0] = north;
            values[1][1] = west;
            values[2] = new double[2];
            values[2][0] = south;
            values[2][1] = east;
            values[3] = new double[2];
            values[3][0] = south;
            values[3][1] = west;
            this.geometry = new Geometry(values);
            bbox = new double[]{north, west, south, east};
        }

    }

    public Properties getProperties() {
        return properties;
    }

    public String getCollection() {
        return collection;
    }

    public double[] getBbox() {
        return bbox;
    }

    public Geometry getGeometry() {
        return geometry;
    }

    public String getType() {
        return type;
    }

    public String getStac_version() {
        return stac_version;
    }

    public List<String> getStac_extensions() {
        return stac_extensions;
    }

}
