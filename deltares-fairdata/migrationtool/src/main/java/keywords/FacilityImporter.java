package keywords;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class FacilityImporter {
    public static Map<String, Facility> importFile(File file) throws IOException {
        Map<String, Facility> facilities = new HashMap<>();
        try (var reader = new BufferedReader(new FileReader(file))) {
            String line = reader.readLine();
            while (line != null) {
                line = reader.readLine();
                if (line != null) {
                    String[] split = line.split(",");
                    var facility = new Facility(split[0], split[1]);
                    facilities.put(facility.id(), facility);
                }

            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return facilities;
    }
}
