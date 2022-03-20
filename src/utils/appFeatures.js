class appFeatures {
	constructor(query, queryString) {
		this.query = query;
		this.queryString = queryString;
		// this.user = curUser;
	}

	filter() {
		const queryObj = { ...this.queryString };

		// removing these fields from the query object
		const removedFields = ['page', 'sort', 'limit', 'attributes'];
		removedFields.forEach((el) => delete queryObj[el]);

		let queryStr = JSON.stringify(queryObj);

		// url ->  /tickets/price[gte]=500  req.query will be {"price":{"gte":"200","lte":"500"}} but needed {"price":{"$gte":"200","$lte":"500"}}
		queryStr = queryStr.replace(
			/\b(gte|gt|lte|lt)\b/g,
			(match) => `$${match}`
		);

		this.query = this.query.find(JSON.parse(queryStr));
		return this;
	}

	sort() {
		if (this.queryString.sort) {
			// to sort more than one attribute separated by a comma
			const sortBy = this.queryString.sort.split(',').join(' ');
			//  ticket?sort=price -> ascending order; ticket?sort=-price descending order
			this.query = this.query.sort(sortBy);
		} else {
			// default sorting by price
			this.query = this.query.sort('price');
		}

		return this;
	}

	limitattribute() {
		if (this.queryString.attributes) {
			// ticket?req.query.attributes=name,description,price,countries - replacing comma with space for query
			const attributes = this.queryString.attributes.split(',').join(' ');
			// ticket?attributes=name,price -> will show only name and price
			this.query = this.query.select(attributes);
		} else {
			//	with "-" excludes __v attribute
			this.query = this.query.select('-__v');
		}

		return this;
	}

	paginate() {
		const page = this.queryString.page * 1 || 1;
		const limit = this.queryString.limit * 1 || 100;
		const skip = (page - 1) * limit;

		this.query = this.query.skip(skip).limit(limit);

		return this;
	}
}
module.exports = appFeatures;
