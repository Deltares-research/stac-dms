package keywords;

import java.util.Objects;

public final class KeywordNode {
    private final String id;
    private final String parentId;
    private final Keyword keyword;
    private final Facility facility;

    public KeywordNode(String id, String parentId, Keyword keyword, Facility facility) {
        this.id = id;
        this.parentId = parentId;
        this.keyword = keyword;
        this.facility = facility;
    }

    public String id() {
        return id;
    }

    public String parentId() {
        return parentId;
    }

    public Keyword keyword() {
        return keyword;
    }

    public Facility facility() {
        return facility;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == this) return true;
        if (obj == null || obj.getClass() != this.getClass()) return false;
        var that = (KeywordNode) obj;
        return Objects.equals(this.id, that.id) &&
                Objects.equals(this.parentId, that.parentId) &&
                Objects.equals(this.keyword, that.keyword) &&
                Objects.equals(this.facility, that.facility);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, parentId, keyword, facility);
    }

    @Override
    public String toString() {
        return "KeywordNode[" +
                "id=" + id + ", " +
                "parentId=" + parentId + ", " +
                "keyword=" + keyword + ", " +
                "facility=" + facility + ']';
    }


}
