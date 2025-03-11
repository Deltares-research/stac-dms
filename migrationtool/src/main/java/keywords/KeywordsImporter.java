package keywords;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class KeywordsImporter {
    public static Map<String, Keyword> importFile(File file) throws IOException {
        Map<String, Keyword> keywords = new HashMap<>();
        try (var reader = new BufferedReader(new FileReader(file))) {
            String line = reader.readLine();
            while (line != null) {
                line = reader.readLine();
                if (line != null) {
                    String[] split = line.split(",");
                    String dutchKeyword = split[2].equals("null") ? "" : split[2];
                    var keyword = new Keyword(split[0], split[1], dutchKeyword, split[3], Boolean.parseBoolean(split[4]));
                    keywords.put(keyword.id(), keyword);
                }

            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return keywords;
    }
}
