import java.util.ArrayList;

public class DataSet {
    private ArrayList<String> subjects = new ArrayList<>();//done
    private String title;//done
    private String creator;
    private String description;//done
    private String publisher;
    private String date;
    private String modified;
    private String type;
    private String format;
    private String source;
    private String language;
    private String rights;
    private String coverage;//done

    public ArrayList<String> getSubjects() {
        return subjects;
    }

    public String getTitle() {
        return title;
    }

    public String getCreator() {
        return creator;
    }

    public void setSubjects(ArrayList<String> subjects) {
        this.subjects = subjects;
    }

    public String getModified() {
        return modified;
    }

    public void setModified(String modified) {
        this.modified = modified;
    }

    public String getDescription() {
        return description;
    }

    public String getPublisher() {
        return publisher;
    }

    public String getDate() {
        return date;
    }

    public String getType() {
        return type;
    }

    public String getFormat() {
        return format;
    }

    public String getSource() {
        return source;
    }

    public String getLanguage() {
        return language;
    }

    public String getRights() {
        return rights;
    }

    public String getCoverage() {
        return coverage;
    }

    public void addSubject(String subject) {
        subjects.add(subject);
    }
    public void setTitle(String title){
        this.title = title;
    }
    public void setCreator(String creator){
        this.creator = creator;
    }
    public void setDescription(String description){
        this.description = description;
    }
    public void setPublisher(String publisher){
        this.publisher = publisher;
    }
    public void setDate(String date){
        this.date = date;
    }
    public void setType(String type){
        this.type = type;
    }
    public void setFormat(String format){
        this.format = format;
    }
    public void setSource(String source){
        this.source = source;
    }
    public void setLanguage(String language){
        this.language = language;
    }
    public void setRights(String rights){
        this.rights = rights;
    }
    public void setCoverage(String coverage){
        this.coverage = coverage;
    }
}
