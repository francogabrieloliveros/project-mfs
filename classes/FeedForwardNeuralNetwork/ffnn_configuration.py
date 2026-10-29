class FFNNConfiguration:
    CURRENT_CONFIGURATION = {
        "window_size": 3,
        "embedding_dimension": 16,
        "hidden_layer_dimension": 32,
        "learning_rate": 0.1,
    }

    def __init__(self, vocabulary_size, configuration=None):
        if configuration is None:
            configuration = self.CURRENT_CONFIGURATION.copy() 
        
        self.vocabulary_size = vocabulary_size
        self.window_size = configuration["window_size"]
        self.embedding_dimension = configuration["embedding_dimension"]
        self.hidden_layer_dimension = configuration["hidden_layer_dimension"]
        self.learning_rate = configuration["learning_rate"]
