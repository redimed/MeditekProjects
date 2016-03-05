module.exports = React.createClass({
    componentDidMount: function(){
        $(this.refs.markdown).summernote({
            height: 'auto',
            focus: true
        })
    },
    setValue: function(value){
        $(this.refs.markdown).code(value);
    },
    getValue: function(){
        return $(this.refs.markdown).code();
    },
	render: function(){
        return (
            <div ref="markdown"/>
        )
	}
})