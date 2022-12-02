/**
 * @class SchedulerService
 * @description SchedulerService schedules jobs based on defined interval.
 * @howTo
 * - npm install --save node-cron
 * - app/hooks.js > boot() > app.loadService('app.services.SchedulerService')
 */
module.exports = class SchedulerService extends ScheduleRunner {

    constructor(app) {
        super()
        if(Config.app('debug')) console.log("* SchedulerService")

        /**
         * Schedule your jobs from {/app/jobs/...}
         */
        this.runBySeconds(resolve('app.jobs.TestJob'), 5)
        // this.runByMinutes(resolve('app.jobs.TestJob'), 1)
        // this.runByHours(resolve('app.jobs.TestJob'), 1)
        // this.runByDays(resolve('app.jobs.TestJob'), 1)

        /** 
         * Start the SchedulerService
        */
        this.start()
    }

}