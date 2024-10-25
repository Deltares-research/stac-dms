import java.util.ArrayList;
import java.util.List;

public class DataSetCollector {
    private ArrayList<DataSet> dataSets = new ArrayList<>();
    private DataSet dataSet;

    public ArrayList<DataSet> getDataSets() {
        return dataSets;
    }

    public DataSet createNewDataSet() {
        if (dataSet != null) {
            dataSets.add(dataSet);
        }
        dataSet = new DataSet();
        return dataSet;
    }

    public void addSubject(String subject) {
        dataSet.addSubject(subject);
    }

    public void setTitle(String title) {
        dataSet.setTitle(title);
    }

    public void setCreator(String creator) {
        dataSet.setCreator(creator);
    }

    public void setDescription(String description) {
        dataSet.setDescription(description);
    }

    public void setPublisher(String publisher) {
        dataSet.setPublisher(publisher);
    }

    public void setDate(String date) {
        dataSet.setDate(date);
    }
    public void setModified(String date){
        dataSet.setModified(date);
    }

    public void setType(String type) {
        dataSet.setType(type);
    }

    public void setFormat(String format) {
        dataSet.setFormat(format);
    }

    public void setSource(String source) {
        dataSet.setSource(source);
    }

    public void setLanguage(String language) {
        dataSet.setLanguage(language);
    }

    public void setRights(String rights) {
        dataSet.setRights(rights);
    }

    public void setCoverage(String coverage) {
        dataSet.setCoverage(coverage);
    }
}
