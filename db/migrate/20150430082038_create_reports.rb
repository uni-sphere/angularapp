class CreateReports < ActiveRecord::Migration
  def change
    create_table :reports do |t|
      t.integer :downloads, default: 0
      t.integer :node_id

      t.timestamps
    end
  end
end
