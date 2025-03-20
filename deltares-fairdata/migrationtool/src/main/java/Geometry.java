public class Geometry {
    private double[][] coordinates;
    private String type = "MultiPoint";

    public Geometry(double[][] coordinates) {
        this.coordinates = coordinates;
    }

    public String getType() {
        return type;
    }

    public double[][] getCoordinates() {
        return coordinates;
    }
}
