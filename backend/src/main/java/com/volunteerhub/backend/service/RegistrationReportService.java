package com.volunteerhub.backend.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.ConvertOperators;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import com.volunteerhub.backend.dto.PopularActivityResponse;

@Service
public class RegistrationReportService {

    private static final Logger log = LoggerFactory.getLogger(RegistrationReportService.class);

    private final MongoTemplate mongoTemplate;

    public RegistrationReportService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public List<PopularActivityResponse> getMostPopularActivities(int limit) {
        log.info("Generating most popular activities report - limit={}", limit);

        // $match: status == "REGISTERED"
        AggregationOperation matchRegistered = Aggregation.match(Criteria.where("status").is("REGISTERED"));

        // $group: by activityId, count registrations
        AggregationOperation groupByActivity = Aggregation.group("activityId").count().as("registrationCount");

        // $sort: descending by count
        AggregationOperation sortByCountDesc = Aggregation.sort(Sort.Direction.DESC, "registrationCount");

        // $limit: top N
        AggregationOperation limitResults = Aggregation.limit(limit);

        // Registration.activityId is stored as a plain String, but Activity._id is stored
        // as an ObjectId. $lookup needs matching types, so convert the grouped id first.
        AggregationOperation addActivityObjectId = Aggregation.addFields()
                .addField("activityObjectId")
                .withValue(ConvertOperators.ToObjectId.toObjectId("$_id"))
                .build();

        // $lookup: join in activity details
        AggregationOperation lookupActivity = Aggregation.lookup(
                "activities", "activityObjectId", "_id", "activityDetails");

        AggregationOperation unwindActivity = Aggregation.unwind("activityDetails");

        AggregationOperation projectResult = Aggregation.project()
                .and("_id").as("activityId")
                .and("registrationCount").as("registrationCount")
                .and("activityDetails.title").as("title")
                .and("activityDetails.category").as("category")
                .and("activityDetails.location").as("location");

        Aggregation aggregation = Aggregation.newAggregation(
                matchRegistered,
                groupByActivity,
                sortByCountDesc,
                limitResults,
                addActivityObjectId,
                lookupActivity,
                unwindActivity,
                projectResult
        );

        AggregationResults<PopularActivityResponse> results = mongoTemplate.aggregate(
                aggregation,
                "registrations",
                PopularActivityResponse.class
        );

        return results.getMappedResults();
    }
}