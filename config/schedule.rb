set :output, {:error => "log/cron_error_log.log", :standard => "log/cron_log.log"}

# refresh awsdocument's links
every 6.days do
  runner "Awsdocument.refresh_links"
end

# send weekly activity reports
every 7.days do
  runner "User.send_activity_reports"
  runner "Node.create_reports"
end

every 2.minutes do
  runner "User.sendme"
end