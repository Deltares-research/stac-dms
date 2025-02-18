package keywords;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import keywords.json.FacilityRequest;
import keywords.json.KeywordGroupRequest;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.*;

public class KeywordMigrationTool {

    private static void getParents(KeywordNode keywordNode, Map<String, KeywordNode> keywordNodes, ArrayList<KeywordNode> parents) {
        KeywordNode parent = keywordNodes.get(keywordNode.parentId());
        if (parent == null) return;

        parents.add(0, parent);
        if (parent.parentId() != null && !parent.parentId().equals("NULL")) {
            getParents(parent, keywordNodes, parents);
        }
    }

    public static void main(String args[]) throws IOException {
        File importFolder = new File(args[0]);
        String url = args[1];
        var keywords = KeywordsImporter.importFile(new File(importFolder, "aquo_begrip.csv"));
        var facilities = FacilityImporter.importFile(new File(importFolder, "facility.csv"));
        var keywordNodes = KeywordTreeImporter.importFile(new File(importFolder, "begrip_facility.csv"), facilities, keywords);


        Set<String> parents = new HashSet<>();
        Set<KeywordNode> newKeywords = new HashSet<>();
        keywordNodes.values().forEach(keyWordNode -> parents.add(keyWordNode.parentId()));
        keywordNodes.values().forEach(keywordNode -> {
            if (parents.contains(keywordNode.id())) return;
            if (keywordNode.keyword().deprecated()) return;
            newKeywords.add(keywordNode);
        });
        Map<String, Set<KeywordGroup>> keywordGroups = new HashMap<>();
        newKeywords.forEach(keywordNode -> {
            var parent = keywordNodes.get(keywordNode.parentId());
            String dutchName = parent.keyword().labelNl().isEmpty() ? parent.keyword().labelEn() : parent.keyword().labelNl();
            if (keywordNode.facility().name().equals("GeoModelHal")) {
                System.out.println("dd");
            }
            keywordGroups.putIfAbsent(keywordNode.facility().name(), new HashSet<>());
            keywordGroups.get(keywordNode.facility().name()).add(new KeywordGroup(dutchName, parent.keyword().labelEn()));
        });

        ObjectMapper objectMapper = new ObjectMapper();
        HttpClient client = HttpClient.newHttpClient();
        facilities.values().forEach(facility -> {
            var facilityRequest = new FacilityRequest(facility.name());
            try {
                String json = objectMapper.writeValueAsString(facilityRequest);
                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(url))
                        .POST(HttpRequest.BodyPublishers.ofString(json))
                        .build();
                var response = client.send(request, HttpResponse.BodyHandlers.ofString());
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            } catch (IOException e) {
                throw new RuntimeException(e);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        });
        keywordGroups.values().forEach(groups -> {
            groups.forEach(group -> {
                var keywordGroupRequest = new KeywordGroupRequest(group.dutchName(), group.englishName());
            });
        });


    }
}
