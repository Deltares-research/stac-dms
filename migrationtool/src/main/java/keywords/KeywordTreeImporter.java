package keywords;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.security.Key;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class KeywordTreeImporter {
    public static Map<String, KeywordNode> importFile(File file, Map<String, Facility> facilities, Map<String, Keyword> keywords) throws IOException {
        Map<String, KeywordNode> keywordNodes = new HashMap<>();
        try (var reader = new BufferedReader(new FileReader(file))) {
            String line = reader.readLine();
            while (line != null) {
                line = reader.readLine();
                if (line != null) {
                    String[] split = line.split(",");
                    Keyword keyword = keywords.get(split[2]);
                    Facility facility = facilities.get(split[3]);
                    var keywordNode = new KeywordNode(split[0], split[1], keyword, facility);
                    keywordNodes.put(keywordNode.id(), keywordNode);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return keywordNodes;
    }
}
