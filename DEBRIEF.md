# Bugs:

* API call fails. LTQ/GTQ are wrong.

Correct code.


```worker.js

      filters: [
        { propertyName, operator: 'GT', value: `${date.valueOf()}` },
        { propertyName, operator: 'LT', value: `${nowDate.valueOf()}` }
      ]
```

* Printing the queue truncates. That's just how prettyprinting works
  in Node.


```
const goal = actions => {
  // this is where the data will be written to the database
  actions.forEach((action) => {
    console.log(action);
  })
};
```


# Readability

## DRY

This could be extracted
```
    let tryCount = 0;
    while (tryCount <= 4) {
      try {
        searchResult = await hubspotClient.crm.contacts.searchApi.doSearch(searchObject);
        break;
      } catch (err) {
        tryCount++;

        if (new Date() > expirationDate) await refreshAccessToken(domain, hubId);

        await new Promise((resolve, reject) => setTimeout(resolve, 5000 * Math.pow(2, tryCount)));
      }
    }
```

This can be written in a generic way:
```
    try {
      await processContacts(domain, account.hubId, q);
      console.log('process contacts');
    } catch (err) {
      console.log(err, { apiKey: domain.apiKey, metadata: { operation: 'processContacts', hubId: account.hubId } });
    }

    try {
      await processCompanies(domain, account.hubId, q);
      console.log('process companies');
    } catch (err) {
      console.log(err, { apiKey: domain.apiKey, metadata: { operation: 'processCompanies', hubId: account.hubId } });
    }

    try {
      await processMeetings(domain, account.hubId, q);
      console.log('process meetings');
    } catch (err) {
      console.log(err, { apiKey: domain.apiKey, metadata: { operation: 'processMeetings', hubId: account.hubId } });
    }

    try {
      await drainQueue(domain, actions, q);
      console.log('drain queue');
    } catch (err) {
      console.log(err, { apiKey: domain.apiKey, metadata: { operation: 'drainQueue', hubId: account.hubId } });
    }
```


# Magic Numbers

Plenty of "magic numbers". Like, why are we substracting 2000 to
action date?

Why are we initializing the queue with 10000000?

Sometimes just naming the constants and just a comment helps figuring
this out.

# Scalability

Unsure. Do we need to do await between contacts/companies and
Meetings?


# Reliability

Having this in a single process means that if you add a breaking bug
on companies, it affects all the pipeline afterwards. For ingestion
I'd try to isolate the processes so breaking one thing doesn't break
another one.


# Rate-Limits

Had a couple of times where it would just rate-limit. Ideally hubspot
rate limits need to be accounted for.


# Have you heard about unit tests?


Not going to say anything here.


Prompt said to limit myself to 8-10 sentences. So stopping here.
